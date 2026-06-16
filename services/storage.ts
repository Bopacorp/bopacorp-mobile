import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

export const getStorageItem = async (key: string): Promise<string | null> => {
  try {
    if (isWeb) {
      if (typeof window !== "undefined" && window.localStorage) {
        return localStorage.getItem(key);
      }
      return null;
    }
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error reading key "${key}" from storage:`, error);
    return null;
  }
};

export const setStorageItem = async (key: string, value: string): Promise<void> => {
  try {
    if (isWeb) {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(key, value);
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error writing key "${key}" to storage:`, error);
  }
};

export const removeStorageItem = async (key: string): Promise<void> => {
  try {
    if (isWeb) {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(key);
      }
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Error removing key "${key}" from storage:`, error);
  }
};
