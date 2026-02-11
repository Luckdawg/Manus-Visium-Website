import { useMemo } from "react";
import { validatePasswordStrength, getStrengthColor, getStrengthLabel } from "@shared/passwordValidator";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
  showFeedback?: boolean;
  compact?: boolean;
}

export default function PasswordStrengthIndicator({
  password,
  showFeedback = true,
  compact = false,
}: PasswordStrengthIndicatorProps) {
  const result = useMemo(() => validatePasswordStrength(password), [password]);

  if (!password) {
    return null;
  }

  const strengthColor = getStrengthColor(result.strength);
  const strengthLabel = getStrengthLabel(result.strength);

  return (
    <div className="space-y-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${result.score}%`,
              backgroundColor: strengthColor,
            }}
          />
        </div>
        <span
          className="text-sm font-semibold min-w-fit"
          style={{ color: strengthColor }}
        >
          {strengthLabel}
        </span>
      </div>

      {/* Feedback */}
      {showFeedback && !compact && (
        <div className="space-y-2">
          {/* Requirements Checklist */}
          <div className="space-y-1">
            <RequirementItem
              met={result.requirements.minLength}
              label="At least 12 characters"
            />
            <RequirementItem
              met={result.requirements.hasUppercase}
              label="One uppercase letter (A-Z)"
            />
            <RequirementItem
              met={result.requirements.hasLowercase}
              label="One lowercase letter (a-z)"
            />
            <RequirementItem
              met={result.requirements.hasNumbers}
              label="One number (0-9)"
            />
            <RequirementItem
              met={result.requirements.hasSpecialChars}
              label="One special character (!@#$%^&*)"
            />
          </div>

          {/* Additional Feedback */}
          {result.feedback.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 space-y-1">
                  {result.feedback.map((item, idx) => (
                    <div key={idx}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {result.isValid && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                Password meets all security requirements
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface RequirementItemProps {
  met: boolean;
  label: string;
}

function RequirementItem({ met, label }: RequirementItemProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
          met
            ? "bg-green-500 border-green-500"
            : "border-slate-300 bg-white"
        }`}
      >
        {met && <span className="text-white text-xs font-bold">✓</span>}
      </div>
      <span className={met ? "text-green-700 font-medium" : "text-slate-600"}>
        {label}
      </span>
    </div>
  );
}
