import { describe, it, expect } from "vitest";
import { validatePasswordStrength, getStrengthColor, getStrengthLabel } from "../passwordValidator";

describe("Password Strength Validator", () => {
  describe("validatePasswordStrength", () => {
    it("should reject passwords shorter than 12 characters", () => {
      const result = validatePasswordStrength("Short1!");
      expect(result.isValid).toBe(false);
      expect(result.requirements.minLength).toBe(false);
      expect(result.feedback).toContain("Password must be at least 12 characters");
    });

    it("should reject passwords without uppercase letters", () => {
      const result = validatePasswordStrength("lowercase123!");
      expect(result.isValid).toBe(false);
      expect(result.requirements.hasUppercase).toBe(false);
      expect(result.feedback).toContain("Include at least one uppercase letter (A-Z)");
    });

    it("should reject passwords without lowercase letters", () => {
      const result = validatePasswordStrength("UPPERCASE123!");
      expect(result.isValid).toBe(false);
      expect(result.requirements.hasLowercase).toBe(false);
      expect(result.feedback).toContain("Include at least one lowercase letter (a-z)");
    });

    it("should reject passwords without numbers", () => {
      const result = validatePasswordStrength("NoNumbers!Here");
      expect(result.isValid).toBe(false);
      expect(result.requirements.hasNumbers).toBe(false);
      expect(result.feedback).toContain("Include at least one number (0-9)");
    });

    it("should reject passwords without special characters", () => {
      const result = validatePasswordStrength("NoSpecial123");
      expect(result.isValid).toBe(false);
      expect(result.requirements.hasSpecialChars).toBe(false);
      expect(result.feedback).toContain("Include at least one special character");
    });

    it("should accept valid strong passwords", () => {
      const result = validatePasswordStrength("ValidPassword123!");
      expect(result.isValid).toBe(true);
      expect(result.requirements.minLength).toBe(true);
      expect(result.requirements.hasUppercase).toBe(true);
      expect(result.requirements.hasLowercase).toBe(true);
      expect(result.requirements.hasNumbers).toBe(true);
      expect(result.requirements.hasSpecialChars).toBe(true);
      expect(result.feedback).toHaveLength(0);
    });

    it("should score passwords correctly", () => {
      const weakPassword = validatePasswordStrength("weak");
      expect(weakPassword.score).toBeLessThan(20);
      expect(weakPassword.strength).toBe("weak");

      const fairPassword = validatePasswordStrength("Fair1!");
      expect(fairPassword.score).toBeGreaterThanOrEqual(20);
      expect(fairPassword.score).toBeLessThan(40);

      const strongPassword = validatePasswordStrength("StrongPass123!");
      expect(strongPassword.score).toBeGreaterThanOrEqual(60);
      expect(strongPassword.strength).toMatch(/strong|very-strong/);
    });

    it("should give bonus points for extra length", () => {
      const mediumPassword = validatePasswordStrength("Medium123!Pass");
      const longPassword = validatePasswordStrength("VeryLongPassword123!WithExtraLength");
      
      expect(longPassword.score).toBeGreaterThan(mediumPassword.score);
    });

    it("should handle all special character types", () => {
      const specialChars = "!@#$%^&*()_+-=[]{}';:\"\\|,.<>/?";
      
      for (const char of specialChars) {
        const password = `ValidPass123${char}`;
        const result = validatePasswordStrength(password);
        expect(result.requirements.hasSpecialChars).toBe(true);
      }
    });
  });

  describe("getStrengthColor", () => {
    it("should return correct colors for each strength level", () => {
      expect(getStrengthColor("weak")).toBe("#ef4444");
      expect(getStrengthColor("fair")).toBe("#f97316");
      expect(getStrengthColor("good")).toBe("#eab308");
      expect(getStrengthColor("strong")).toBe("#84cc16");
      expect(getStrengthColor("very-strong")).toBe("#22c55e");
      expect(getStrengthColor("unknown")).toBe("#6b7280");
    });
  });

  describe("getStrengthLabel", () => {
    it("should return correct labels for each strength level", () => {
      expect(getStrengthLabel("weak")).toBe("Weak");
      expect(getStrengthLabel("fair")).toBe("Fair");
      expect(getStrengthLabel("good")).toBe("Good");
      expect(getStrengthLabel("strong")).toBe("Strong");
      expect(getStrengthLabel("very-strong")).toBe("Very Strong");
      expect(getStrengthLabel("unknown")).toBe("Unknown");
    });
  });

  describe("Real-world password examples", () => {
    it("should reject common weak passwords", () => {
      const weakPasswords = [
        "password",
        "123456",
        "qwerty",
        "abc123",
        "letmein",
      ];

      weakPasswords.forEach((pwd) => {
        const result = validatePasswordStrength(pwd);
        expect(result.isValid).toBe(false);
      });
    });

    it("should accept realistic strong passwords", () => {
      const strongPasswords = [
        "MySecurePass123!",
        "Correct-Horse-Battery-Staple1!",
        "P@ssw0rd2024Secure",
        "VisiumPartner#2024",
        "SecureP@ss123456",
      ];

      strongPasswords.forEach((pwd) => {
        const result = validatePasswordStrength(pwd);
        expect(result.isValid).toBe(true);
      });
    });
  });
});
