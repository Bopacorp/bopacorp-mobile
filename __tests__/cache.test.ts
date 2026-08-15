// Cache Layer Unit Tests for Bopacorp CRM Mobile
import { servicesCache } from "../services/ClientServices";

describe("MemoryCache Layer", () => {
  beforeEach(() => {
    servicesCache.clear();
  });

  it("should store and retrieve data correctly", () => {
    const testData = { name: "Test Client", id: "123" };
    servicesCache.set("client-123", testData);

    expect(servicesCache.get("client-123")).toEqual(testData);
  });

  it("should return null for non-existent keys", () => {
    expect(servicesCache.get("non-existent")).toBeNull();
  });

  it("should invalidate keys starting with a specific prefix", () => {
    servicesCache.set("negotiation-list", [1, 2, 3]);
    servicesCache.set("negotiation-detail-1", { id: 1 });
    servicesCache.set("client-list", [4, 5]);

    // Invalidate negotiations
    servicesCache.invalidate("negotiation");

    expect(servicesCache.get("negotiation-list")).toBeNull();
    expect(servicesCache.get("negotiation-detail-1")).toBeNull();
    expect(servicesCache.get("client-list")).toEqual([4, 5]); // remains intact
  });

  it("should clear all keys", () => {
    servicesCache.set("key1", "val1");
    servicesCache.set("key2", "val2");

    servicesCache.clear();

    expect(servicesCache.get("key1")).toBeNull();
    expect(servicesCache.get("key2")).toBeNull();
  });
});
