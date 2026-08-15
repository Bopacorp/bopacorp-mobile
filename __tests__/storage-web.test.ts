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
});
