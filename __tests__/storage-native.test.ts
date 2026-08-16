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

  it("should return null when SecureStore read fails", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error("secure read failed"));
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(storage.getStorageItem("token")).resolves.toBeNull();
    expect(consoleError).toHaveBeenCalledWith(
      'Error reading key "token" from storage:',
      expect.any(Error),
    );
  });

  it("should swallow SecureStore write failures", async () => {
    (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(new Error("secure write failed"));
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(storage.setStorageItem("token", "value")).resolves.toBeUndefined();
    expect(consoleError).toHaveBeenCalledWith(
      'Error writing key "token" to storage:',
      expect.any(Error),
    );
  });

  it("should swallow SecureStore delete failures", async () => {
    (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(new Error("secure delete failed"));
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(storage.removeStorageItem("token")).resolves.toBeUndefined();
    expect(consoleError).toHaveBeenCalledWith(
      'Error removing key "token" from storage:',
      expect.any(Error),
    );
  });
});
