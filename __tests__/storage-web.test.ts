// Storage Service Web Unit Tests
import * as SecureStore from "expo-secure-store";

// Mock react-native Platform to be 'web' BEFORE importing storage
jest.mock("react-native", () => ({
  Platform: { OS: "web" },
}));

// Mock SecureStore
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe("storage.ts - Web Platform Behavior", () => {
  let storage: any;
  let localMock: any;
  let originalLocalStorage: any;

  beforeAll(() => {
    originalLocalStorage = global.localStorage;
  });

  afterAll(() => {
    global.localStorage = originalLocalStorage;
  });

  beforeEach(() => {
    // Mock window.localStorage
    localMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(global, "window", {
      value: { localStorage: localMock },
      writable: true,
    });
    global.localStorage = localMock;

    storage = require("../services/storage");
  });

  it("should write to localStorage on web", async () => {
    await storage.setStorageItem("token", "val-web");
    expect(localMock.setItem).toHaveBeenCalledWith("token", "val-web");
    expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
  });

  it("should read from localStorage on web", async () => {
    localMock.getItem.mockReturnValue("val-web");
    const result = await storage.getStorageItem("token");
    expect(result).toBe("val-web");
    expect(localMock.getItem).toHaveBeenCalledWith("token");
    expect(SecureStore.getItemAsync).not.toHaveBeenCalled();
  });

  it("should delete from localStorage on web", async () => {
    await storage.removeStorageItem("token");
    expect(localMock.removeItem).toHaveBeenCalledWith("token");
    expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled();
  });

  it("should return null when localStorage is unavailable", async () => {
    Object.defineProperty(global, "window", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    await expect(storage.getStorageItem("token")).resolves.toBeNull();
    expect(localMock.getItem).not.toHaveBeenCalled();
  });

  it("should not throw when localStorage is unavailable for writes", async () => {
    Object.defineProperty(global, "window", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    await expect(storage.setStorageItem("token", "value")).resolves.toBeUndefined();
    await expect(storage.removeStorageItem("token")).resolves.toBeUndefined();
    expect(localMock.setItem).not.toHaveBeenCalled();
    expect(localMock.removeItem).not.toHaveBeenCalled();
  });

  it("should return null when localStorage read fails", async () => {
    localMock.getItem.mockImplementation(() => {
      throw new Error("local read failed");
    });
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(storage.getStorageItem("token")).resolves.toBeNull();
    expect(consoleError).toHaveBeenCalledWith(
      'Error reading key "token" from storage:',
      expect.any(Error),
    );
  });

  it("should swallow localStorage write and delete failures", async () => {
    localMock.setItem.mockImplementation(() => {
      throw new Error("local write failed");
    });
    localMock.removeItem.mockImplementation(() => {
      throw new Error("local delete failed");
    });
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(storage.setStorageItem("token", "value")).resolves.toBeUndefined();
    await expect(storage.removeStorageItem("token")).resolves.toBeUndefined();
    expect(consoleError).toHaveBeenCalledTimes(2);
  });
});
