import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, Mail, Lock } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function PartnerLoginNew() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const loginMutation = trpc.partner.login.useMutation();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    try {
      const result = await loginMutation.mutateAsync({
        email,
        password,
      });

      // Store partnerId in localStorage for dashboard access
      if (result.partnerId) {
        localStorage.setItem('partnerSessionId', result.partnerId.toString());
      }

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/partners/dashboard");
      }, 500);
    } catch (error: any) {
      setApiError(error.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 flex items-center">
      <div className="w-full max-w-md mx-auto">
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
            <CardTitle>Partner Portal Login</CardTitle>
            <CardDescription className="text-white/90">
              Sign in to your partner account
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="your.email@company.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => navigate("/partners/recover")}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-10"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Registration Link */}
              <p className="text-center text-sm text-gray-600 mt-6 pt-4 border-t border-gray-200">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/partners/register")}
                  className="text-primary hover:underline font-medium"
                >
                  Register here
                </button>
              </p>
            </form>

            {/* Help Section */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-xs text-blue-700 mb-3">
                If you're having trouble logging in, please contact our partner support team.
              </p>
              <a
                href="mailto:partners@visium.com"
                className="text-xs text-primary hover:underline font-medium"
              >
                partners@visium.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
