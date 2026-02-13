import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function PartnerRegister() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    contactName: "",
    phone: "",
    website: "",
    partnerType: "Reseller" as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const registerMutation = trpc.partner.register.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.companyName) newErrors.companyName = "Company name is required";
    if (!formData.contactName) newErrors.contactName = "Contact name is required";
    if (!formData.partnerType) newErrors.partnerType = "Partner type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    try {
      const result = await registerMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        contactName: formData.contactName,
        phone: formData.phone || undefined,
        website: formData.website || undefined,
        partnerType: formData.partnerType,
      });

      // Auto-login after successful registration
      if (result.companyId) {
        localStorage.setItem('companyId', result.companyId.toString());
        // Force a small delay to ensure localStorage is written
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setStep("success");
      // Redirect immediately to dashboard
      navigate("/partners/dashboard")
    } catch (error: any) {
      setApiError(error.message || "Registration failed. Please try again.");
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your partner account has been created. You can now log in with your email and password.
            </p>
            <p className="text-sm text-gray-500 mb-6">Redirecting to login page in 3 seconds...</p>
            <Button onClick={() => navigate("/partners/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
            <CardTitle>Partner Registration</CardTitle>
            <CardDescription className="text-white/90">
              Create your partner account to access the portal
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
              {/* Company Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                    errors.companyName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your company name"
                />
                {errors.companyName && <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>}
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                    errors.contactName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your full name"
                />
                {errors.contactName && <p className="text-xs text-red-600 mt-1">{errors.contactName}</p>}
              </div>

              {/* Partner Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Partner Type *</label>
                <select
                  name="partnerType"
                  value={formData.partnerType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                    errors.partnerType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="Reseller">Reseller</option>
                  <option value="Technology Partner">Technology Partner</option>
                  <option value="System Integrator">System Integrator</option>
                  <option value="Managed Service Provider">Managed Service Provider</option>
                  <option value="Consulting Partner">Consulting Partner</option>
                  <option value="Channel Partner">Channel Partner</option>
                  <option value="OEM Partner">OEM Partner</option>
                  <option value="Other">Other</option>
                </select>
                {errors.partnerType && <p className="text-xs text-red-600 mt-1">{errors.partnerType}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="your.email@company.com"
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="At least 8 characters"
                />
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Phone (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Website (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  placeholder="https://your-company.com"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/partners/login")}
                  className="text-primary hover:underline font-medium"
                >
                  Log in here
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
