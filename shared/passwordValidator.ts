/**
 * Password Strength Validation Utility
 * Enforces strong password requirements and provides real-time feedback
 */

export interface PasswordStrengthResult {
  score: number; // 0-100
  strength: "weak" | "fair" | "good" | "strong" | "very-strong";
  feedback: string[];
  isValid: boolean;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
  };
}

const REQUIREMENTS = {
  minLength: 12,
  specialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g,
};

/**
 * Validate password strength against requirements
 * Minimum: 12 characters, uppercase, lowercase, number, special character
 */
export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;

  // Check minimum length (12 characters)
  const hasMinLength = password.length >= REQUIREMENTS.minLength;
  if (!hasMinLength) {
    feedback.push(`Password must be at least ${REQUIREMENTS.minLength} characters`);
  } else {
    score += 20;
  }

  // Check for uppercase letters
  const hasUppercase = /[A-Z]/.test(password);
  if (!hasUppercase) {
    feedback.push("Include at least one uppercase letter (A-Z)");
  } else {
    score += 20;
  }

  // Check for lowercase letters
  const hasLowercase = /[a-z]/.test(password);
  if (!hasLowercase) {
    feedback.push("Include at least one lowercase letter (a-z)");
  } else {
    score += 20;
  }

  // Check for numbers
  const hasNumbers = /[0-9]/.test(password);
  if (!hasNumbers) {
    feedback.push("Include at least one number (0-9)");
  } else {
    score += 20;
  }

  // Check for special characters
  const hasSpecialChars = REQUIREMENTS.specialChars.test(password);
  if (!hasSpecialChars) {
    feedback.push("Include at least one special character (!@#$%^&* etc.)");
  } else {
    score += 20;
  }

  // Bonus points for length beyond minimum
  if (password.length >= 16) {
    score = Math.min(100, score + 5);
  }
  if (password.length >= 20) {
    score = Math.min(100, score + 5);
  }

  // Determine strength level
  let strength: "weak" | "fair" | "good" | "strong" | "very-strong";
  if (score < 20) {
    strength = "weak";
  } else if (score < 40) {
    strength = "fair";
  } else if (score < 60) {
    strength = "good";
  } else if (score < 80) {
    strength = "strong";
  } else {
    strength = "very-strong";
  }

  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumbers && hasSpecialChars;

  return {
    score: Math.min(100, score),
    strength,
    feedback,
    isValid,
    requirements: {
      minLength: hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSpecialChars,
    },
  };
}

/**
 * Get color for password strength indicator
 */
export function getStrengthColor(strength: string): string {
  switch (strength) {
    case "weak":
      return "#ef4444"; // red
    case "fair":
      return "#f97316"; // orange
    case "good":
      return "#eab308"; // yellow
    case "strong":
      return "#84cc16"; // lime
    case "very-strong":
      return "#22c55e"; // green
    default:
      return "#6b7280"; // gray
  }
}

/**
 * Get label for password strength
 */
export function getStrengthLabel(strength: string): string {
  switch (strength) {
    case "weak":
      return "Weak";
    case "fair":
      return "Fair";
    case "good":
      return "Good";
    case "strong":
      return "Strong";
    case "very-strong":
      return "Very Strong";
    default:
      return "Unknown";
  }
}
