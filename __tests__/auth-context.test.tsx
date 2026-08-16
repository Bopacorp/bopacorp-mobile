import { act, renderHook, waitFor } from "@testing-library/react-native";

import { AuthProvider, useAuth } from "../context/AuthContext";
import { apiClient, getAccessToken, setAccessToken } from "../services/api";
import * as storage from "../services/storage";
import {
  accessToken,
  advisorUser,
  nonAdvisorUser,
  refreshToken,
} from "./fixtures/critical-fixtures";

jest.mock("../services/storage", () => ({
  getStorageItem: jest.fn(),
  setStorageItem: jest.fn(),
  removeStorageItem: jest.fn(),
}));

describe("AuthProvider", () => {
  const getStorageItem = storage.getStorageItem as jest.MockedFunction<
    typeof storage.getStorageItem
  >;
  const setStorageItem = storage.setStorageItem as jest.MockedFunction<
    typeof storage.setStorageItem
  >;
  const removeStorageItem = storage.removeStorageItem as jest.MockedFunction<
    typeof storage.removeStorageItem
  >;

  beforeEach(() => {
    getStorageItem.mockResolvedValue(null);
    setStorageItem.mockResolvedValue(undefined);
    removeStorageItem.mockResolvedValue(undefined);
  });

  afterEach(() => {
    setAccessToken(null);
  });

  async function renderAuth() {
    const rendered = await renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(rendered.result.current.isLoading).toBe(false);
    });

    return rendered;
  }

  it("finishes loading without a session", async () => {
    const { result } = await renderAuth();

    expect(result.current.role).toBeNull();
    expect(result.current.user).toBeNull();
    expect(getAccessToken()).toBeNull();
  });

  it("logs in an advisor and stores the refresh token", async () => {
    const post = jest.spyOn(apiClient, "post").mockResolvedValue({
      user: advisorUser,
      tokens: {
        accessToken,
        refreshToken,
      },
    } as any);
    const { result } = await renderAuth();

    await act(async () => {
      await result.current.login(advisorUser.email, "password-test");
    });

    expect(post).toHaveBeenCalledWith("/api/v1/auth/login", {
      email: advisorUser.email,
      password: "password-test",
    });
    expect(result.current.role).toBe("Asesor");
    expect(result.current.user).toEqual(advisorUser);
    expect(getAccessToken()).toBe(accessToken);
    expect(setStorageItem).toHaveBeenCalledWith("refreshToken", refreshToken);
  });

  it("rejects a user who is not an advisor", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(apiClient, "post").mockResolvedValue({
      user: nonAdvisorUser,
      tokens: {
        accessToken,
        refreshToken,
      },
    } as any);
    const { result } = await renderAuth();

    await expect(
      act(async () => {
        await result.current.login(nonAdvisorUser.email, "password-test");
      }),
    ).rejects.toThrow("uso exclusivo para Asesores Comerciales");

    expect(result.current.role).toBeNull();
    expect(result.current.user).toBeNull();
    expect(getAccessToken()).toBeNull();
    expect(setStorageItem).not.toHaveBeenCalled();
  });

  it("propagates an invalid login error", async () => {
    const loginError = { code: "INVALID_CREDENTIALS", message: "Invalid credentials" };
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(apiClient, "post").mockRejectedValue(loginError);
    const { result } = await renderAuth();

    await expect(
      act(async () => {
        await result.current.login(advisorUser.email, "wrong-password");
      }),
    ).rejects.toEqual(loginError);

    expect(result.current.role).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it("restores an advisor session from the refresh token", async () => {
    getStorageItem.mockResolvedValue(refreshToken);
    const post = jest.spyOn(apiClient, "post").mockResolvedValue({
      accessToken: "access-token-refreshed",
      refreshToken: "refresh-token-refreshed",
    } as any);
    const get = jest.spyOn(apiClient, "get").mockResolvedValue(advisorUser as any);

    const { result } = await renderAuth();

    expect(post).toHaveBeenCalledWith("/api/v1/auth/refresh", { refreshToken });
    expect(get).toHaveBeenCalledWith("/api/v1/auth/me");
    expect(result.current.role).toBe("Asesor");
    expect(result.current.user).toEqual(advisorUser);
    expect(getAccessToken()).toBe("access-token-refreshed");
    expect(setStorageItem).toHaveBeenCalledWith("refreshToken", "refresh-token-refreshed");
  });

  it("clears the session when refresh fails", async () => {
    getStorageItem.mockResolvedValue(refreshToken);
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(apiClient, "post").mockRejectedValue(new Error("refresh failed"));

    const { result } = await renderAuth();

    expect(result.current.role).toBeNull();
    expect(result.current.user).toBeNull();
    expect(getAccessToken()).toBeNull();
    expect(removeStorageItem).toHaveBeenCalledWith("refreshToken");
  });

  it("clears the session when the restored user is not an advisor", async () => {
    getStorageItem.mockResolvedValue(refreshToken);
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(apiClient, "post").mockResolvedValue({
      accessToken: "access-token-refreshed",
      refreshToken: "refresh-token-refreshed",
    } as any);
    jest.spyOn(apiClient, "get").mockResolvedValue(nonAdvisorUser as any);

    const { result } = await renderAuth();

    expect(result.current.role).toBeNull();
    expect(result.current.user).toBeNull();
    expect(getAccessToken()).toBeNull();
    expect(removeStorageItem).toHaveBeenCalledWith("refreshToken");
  });

  it("logs out and removes the refresh token", async () => {
    getStorageItem.mockResolvedValueOnce(null).mockResolvedValueOnce(refreshToken);
    const post = jest.spyOn(apiClient, "post");
    post.mockResolvedValueOnce({
      user: advisorUser,
      tokens: { accessToken, refreshToken },
    } as any);
    post.mockResolvedValueOnce(undefined as any);
    const { result } = await renderAuth();

    await act(async () => {
      await result.current.login(advisorUser.email, "password-test");
      await result.current.logout();
    });

    expect(post).toHaveBeenNthCalledWith(2, "/api/v1/auth/logout", {
      refreshToken,
    });
    expect(removeStorageItem).toHaveBeenCalledWith("refreshToken");
    expect(result.current.role).toBeNull();
    expect(result.current.user).toBeNull();
    expect(getAccessToken()).toBeNull();
  });

  it("clears the session even when logout API fails", async () => {
    getStorageItem.mockResolvedValueOnce(null).mockResolvedValueOnce(refreshToken);
    const logoutError = new Error("logout failed");
    jest.spyOn(console, "warn").mockImplementation(() => {});
    const post = jest.spyOn(apiClient, "post");
    post.mockResolvedValueOnce({
      user: advisorUser,
      tokens: { accessToken, refreshToken },
    } as any);
    post.mockRejectedValueOnce(logoutError);
    const { result } = await renderAuth();

    await act(async () => {
      await result.current.login(advisorUser.email, "password-test");
      await result.current.logout();
    });

    expect(removeStorageItem).toHaveBeenCalledWith("refreshToken");
    expect(result.current.role).toBeNull();
    expect(result.current.user).toBeNull();
    expect(getAccessToken()).toBeNull();
  });
});
