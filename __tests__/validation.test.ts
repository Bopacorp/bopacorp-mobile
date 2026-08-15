// Validation tests for Bopacorp CRM Mobile

// Simple validators matching our forms
function validateRuc(ruc: string): boolean {
  return /^\d{13}$/.test(ruc);
}

function validatePhone(phone: string): boolean {
  return /^\d{9,10}$/.test(phone);
}

function validateObservations(obs: string): boolean {
  return obs.trim().length > 0;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

describe("Form Validation Helpers", () => {
  describe("RUC Validation", () => {
    it("should accept valid 13-digit RUC", () => {
      expect(validateRuc("1791253249001")).toBe(true);
      expect(validateRuc("0992345678001")).toBe(true);
    });

    it("should reject RUC with letters or symbols", () => {
      expect(validateRuc("1791253249abc")).toBe(false);
      expect(validateRuc("17912532-9001")).toBe(false);
    });

    it("should reject RUC with incorrect length", () => {
      expect(validateRuc("179125324900")).toBe(false); // 12 digits
      expect(validateRuc("17912532490012")).toBe(false); // 14 digits
      expect(validateRuc("")).toBe(false);
    });
  });

  describe("Phone Validation", () => {
    it("should accept 9 or 10 digit numbers", () => {
      expect(validatePhone("099999999")).toBe(true); // 9 digits
      expect(validatePhone("0999999999")).toBe(true); // 10 digits
    });

    it("should reject non-digit or incorrect length phones", () => {
      expect(validatePhone("09999999")).toBe(false); // 8 digits
      expect(validatePhone("09999999999")).toBe(false); // 11 digits
      expect(validatePhone("09999999a")).toBe(false);
      expect(validatePhone("")).toBe(false);
    });
  });

  describe("Observations Validation", () => {
    it("should accept non-empty string", () => {
      expect(validateObservations("Client requested a catalog demo.")).toBe(true);
      expect(validateObservations("   Met with manager   ")).toBe(true);
    });

    it("should reject blank or whitespace-only observations", () => {
      expect(validateObservations("")).toBe(false);
      expect(validateObservations("   ")).toBe(false);
    });
  });

  describe("Email Validation", () => {
    it("should accept valid email formats", () => {
      expect(validateEmail("info@bopacorp.com")).toBe(true);
      expect(validateEmail("advisor.one@bopacorp.com")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(validateEmail("infobopacorp.com")).toBe(false);
      expect(validateEmail("info@")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });
  });
});
