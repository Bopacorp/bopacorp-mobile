// Storage Service Native Unit Tests
import * as SecureStore from "expo-secure-store";

// Mock react-native Platform to be 'ios' BEFORE importing storage
jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
}));

// Mock SecureStore
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe("storage.ts - Native Platform Behavior (iOS/Android)", () => {
  let storage: any;

  beforeEach(() => {
    jest.clearAllMocks();
    storage = require("../services/storage");
  });

  it("should write to SecureStore on native", async () => {
    await storage.setStorageItem("token", "val-native");
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith("token", "val-native");
  });

  it("should read from SecureStore on native", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("val-native");
    const result = await storage.getStorageItem("token");
    expect(result).toBe("val-native");
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith("token");
  });

  it("should delete from SecureStore on native", async () => {
    await storage.removeStorageItem("token");
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("token");
  });
});
