// API Interceptor Unit Tests for Bopacorp CRM Mobile
import axios from "axios";
import { API_URL, apiClient, setAccessToken, setOnLogout } from "../services/api";
import * as storage from "../services/storage";

jest.mock("../services/storage", () => ({
  getStorageItem: jest.fn(),
  setStorageItem: jest.fn(),
}));

describe("API Axios Interceptors", () => {
  // Extract response interceptor handlers
  const requestHandlers = (apiClient.interceptors.request as any).handlers[0];
  const handlers = (apiClient.interceptors.response as any).handlers[0];
  const onRequest = requestHandlers.fulfilled;
  const onFulfilled = handlers.fulfilled;
  const onRejected = handlers.rejected;
  const getStorageItem = storage.getStorageItem as jest.MockedFunction<
    typeof storage.getStorageItem
  >;
  const setStorageItem = storage.setStorageItem as jest.MockedFunction<
    typeof storage.setStorageItem
  >;

  afterEach(() => {
    setAccessToken(null);
    setOnLogout(() => {});
  });

  describe("Request Interceptor (Authorization)", () => {
    it("adds a bearer token when an access token is available", () => {
      setAccessToken("access-token-test");
      const config = { headers: {} };

      const result = onRequest(config);

      expect(result.headers.Authorization).toBe("Bearer access-token-test");
    });

    it("does not add authorization when no access token is available", () => {
      setAccessToken(null);
      const config = { headers: {} };

      const result = onRequest(config);

      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe("Response Success Interceptor (Unwrapping)", () => {
    it("should extract inner data on success: true", () => {
      const mockResponse = {
        data: {
          success: true,
          data: { id: "client-1", name: "Bopacorp" },
        },
      };

      const result = onFulfilled(mockResponse);
      expect(result).toEqual({ id: "client-1", name: "Bopacorp" });
    });

    it("should reject with backend error on success: false", async () => {
      const mockResponse = {
        data: {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "RUC incorrecto",
          },
        },
      };

      await expect(Promise.resolve(onFulfilled(mockResponse))).rejects.toEqual({
        code: "VALIDATION_ERROR",
        message: "RUC incorrecto",
      });
    });

    it("should return the response intact if success is not defined", () => {
      const mockResponse = {
        status: 200,
        statusText: "OK",
        data: "raw string payload",
      };

      const result = onFulfilled(mockResponse);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Response Failure Interceptor (Error formatting)", () => {
    it("should parse and return standard backend errors", async () => {
      const mockError = {
        response: {
          status: 400,
          data: {
            success: false,
            error: {
              code: "BAD_REQUEST",
              message: "Petición inválida",
            },
          },
        },
      };

      await expect(onRejected(mockError)).rejects.toEqual({
        code: "BAD_REQUEST",
        message: "Petición inválida",
      });
    });

    it("should fallback to default network error on connection failure", async () => {
      const mockError = {
        message: "Timeout connecting to server",
      };

      await expect(onRejected(mockError)).rejects.toEqual({
        code: "NETWORK_ERROR",
        message: "Timeout connecting to server",
      });
    });
  });

  describe("401 refresh flow", () => {
    const createUnauthorizedError = (url = "/api/v1/crm/clients") => ({
      config: {
        url,
        headers: {},
        adapter: jest.fn().mockResolvedValue({
          data: { ok: true },
          status: 200,
          statusText: "OK",
          headers: {},
        }),
      },
      response: {
        status: 401,
      },
      message: "Unauthorized",
    });

    it("refreshes tokens and retries the original request", async () => {
      getStorageItem.mockResolvedValue("refresh-token-old");
      const refreshRequest = jest.spyOn(axios, "post").mockResolvedValue({
        data: {
          success: true,
          data: {
            accessToken: "access-token-new",
            refreshToken: "refresh-token-new",
          },
        },
      } as any);
      const originalError = createUnauthorizedError();

      const result = await onRejected(originalError);

      expect(refreshRequest).toHaveBeenCalledWith(`${API_URL}/api/v1/auth/refresh`, {
        refreshToken: "refresh-token-old",
      });
      expect(setStorageItem).toHaveBeenCalledWith("refreshToken", "refresh-token-new");
      expect((originalError.config as any)._retry).toBe(true);
      expect(originalError.config.headers).toEqual({
        Authorization: "Bearer access-token-new",
      });
      expect(originalError.config.adapter).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        data: { ok: true },
        status: 200,
        statusText: "OK",
      });
      expect(result.headers).toBeDefined();
    });

    it("shares one refresh request between concurrent unauthorized requests", async () => {
      getStorageItem.mockResolvedValue("refresh-token-old");
      let resolveRefresh!: (value: unknown) => void;
      const refreshPromise = new Promise((resolve) => {
        resolveRefresh = resolve;
      });
      const refreshRequest = jest.spyOn(axios, "post").mockReturnValue(refreshPromise as any);
      const firstError = createUnauthorizedError("/api/v1/crm/clients?page=1");
      const secondError = createUnauthorizedError("/api/v1/crm/clients?page=2");

      const first = onRejected(firstError);
      await Promise.resolve();
      const second = onRejected(secondError);

      resolveRefresh({
        data: {
          success: true,
          data: {
            accessToken: "access-token-new",
            refreshToken: "refresh-token-new",
          },
        },
      });

      await expect(Promise.all([first, second])).resolves.toHaveLength(2);
      expect(refreshRequest).toHaveBeenCalledTimes(1);
      expect(firstError.config.adapter).toHaveBeenCalledTimes(1);
      expect(secondError.config.adapter).toHaveBeenCalledTimes(1);
    });

    it("rejects queued requests and invokes logout when refresh fails", async () => {
      getStorageItem.mockResolvedValue("refresh-token-old");
      const refreshError = new Error("refresh failed");
      const onLogout = jest.fn();
      setOnLogout(onLogout);
      jest.spyOn(axios, "post").mockRejectedValue(refreshError);

      const first = onRejected(createUnauthorizedError("/api/v1/crm/clients?page=1"));
      await Promise.resolve();
      const second = onRejected(createUnauthorizedError("/api/v1/crm/clients?page=2"));

      const results = await Promise.allSettled([first, second]);

      expect(results).toEqual([
        { status: "rejected", reason: refreshError },
        { status: "rejected", reason: refreshError },
      ]);
      expect(onLogout).toHaveBeenCalledTimes(1);
    });

    it("does not refresh a request that has already been retried", async () => {
      getStorageItem.mockResolvedValue("refresh-token-old");
      const refreshRequest = jest.spyOn(axios, "post");
      const error = {
        ...createUnauthorizedError(),
        config: {
          ...createUnauthorizedError().config,
          _retry: true,
        },
      };

      await expect(onRejected(error)).rejects.toEqual({
        code: "NETWORK_ERROR",
        message: "Unauthorized",
      });

      expect(refreshRequest).not.toHaveBeenCalled();
      expect(getStorageItem).not.toHaveBeenCalled();
    });

    it.each(["/api/v1/auth/login", "/api/v1/auth/refresh", "/api/v1/auth/logout"])(
      "does not refresh %s automatically",
      async (url) => {
        getStorageItem.mockResolvedValue("refresh-token-old");
        const refreshRequest = jest.spyOn(axios, "post").mockResolvedValue({
          data: {
            success: true,
            data: {
              accessToken: "access-token-new",
              refreshToken: "refresh-token-new",
            },
          },
        } as any);

        await onRejected(createUnauthorizedError(url));

        expect(refreshRequest).not.toHaveBeenCalled();
        expect(getStorageItem).not.toHaveBeenCalled();
      },
    );
  });
});
