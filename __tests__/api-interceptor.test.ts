// API Interceptor Unit Tests for Bopacorp CRM Mobile
import { apiClient } from "../services/api";

describe("API Axios Interceptors", () => {
  // Extract response interceptor handlers
  const handlers = (apiClient.interceptors.response as any).handlers[0];
  const onFulfilled = handlers.fulfilled;
  const onRejected = handlers.rejected;

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
});
