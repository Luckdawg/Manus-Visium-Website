import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function PartnerApplicationForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    partnerType: "Reseller" as const,
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    description: "",
    specializations: [] as string[],
  });

  const createApplicationMutation = trpc.partnerOnboarding.createApplication.useMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecializationChange = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const validateStep = (currentStep: number) => {
    setError("");

    if (currentStep === 1) {
      if (!formData.companyName.trim()) {
        setError("Company name is required");
        return false;
      }
      if (!formData.country.trim()) {
        setError("Country is required");
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.primaryContactName.trim()) {
        setError("Contact name is required");
        return false;
      }
      if (!formData.primaryContactEmail.trim()) {
        setError("Contact email is required");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryContactEmail)) {
        setError("Valid email is required");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setLoading(true);
    try {
      await createApplicationMutation.mutateAsync({
        companyName: formData.companyName,
        website: formData.website || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        country: formData.country,
        zipCode: formData.zipCode || undefined,
        partnerType: formData.partnerType,
        primaryContactName: formData.primaryContactName,
        primaryContactEmail: formData.primaryContactEmail,
        primaryContactPhone: formData.primaryContactPhone || undefined,
        description: formData.description || undefined,
        specializations: formData.specializations.length > 0 ? formData.specializations : undefined,
      });

      setSubmitted(true);
    } catch (err) {
      setError((err as any).message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Application Submitted!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                Thank you for your interest in becoming a Visium partner. We have received your
                application and will review it shortly.
              </p>
              <p className="text-sm text-green-700 mt-2">
                You will receive an email at <strong>{formData.primaryContactEmail}</strong> with
                next steps.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900">What happens next?</h4>
              <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                <li>Our team will review your application (2-3 business days)</li>
                <li>We'll assess your fit and partnership opportunity</li>
                <li>You'll receive approval status and next steps via email</li>
                <li>Upon approval, we'll schedule an onboarding call</li>
              </ul>
            </div>

            <Button
              onClick={() => (window.location.href = "/partners")}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Return to Partners Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Partner Application</CardTitle>
            <CardDescription>
              Join the Visium partner ecosystem. Complete this application to get started.
            </CardDescription>
          </CardHeader>

          {/* Progress Indicator */}
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      s <= step
                        ? "bg-primary text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        s < step ? "bg-primary" : "bg-slate-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-600 mt-3">
              <span>Company Info</span>
              <span>Contact Info</span>
              <span>Details</span>
            </div>
          </div>

          <CardContent className="pt-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Company Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company Name *
                    </label>
                    <Input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Your company name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Website
                    </label>
                    <Input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourcompany.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Country *
                      </label>
                      <Input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="United States"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address
                    </label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        City
                      </label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        State
                      </label>
                      <Input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        ZIP Code
                      </label>
                      <Input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="12345"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Partner Type *
                    </label>
                    <select
                      name="partnerType"
                      value={formData.partnerType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Primary Contact Name *
                    </label>
                    <Input
                      type="text"
                      name="primaryContactName"
                      value={formData.primaryContactName}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Primary Contact Email *
                    </label>
                    <Input
                      type="email"
                      name="primaryContactEmail"
                      value={formData.primaryContactEmail}
                      onChange={handleInputChange}
                      placeholder="email@company.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Primary Contact Phone
                    </label>
                    <Input
                      type="tel"
                      name="primaryContactPhone"
                      value={formData.primaryContactPhone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Details */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Tell us about your company, services, and why you're interested in partnering with Visium"
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Specializations (select all that apply)
                    </label>
                    <div className="space-y-2">
                      {[
                        "Cybersecurity",
                        "Smart Cities",
                        "Critical Infrastructure",
                        "Healthcare",
                        "Financial Services",
                        "Supply Chain",
                        "Telecommunications",
                        "Manufacturing",
                      ].map((spec) => (
                        <label key={spec} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.specializations.includes(spec)}
                            onChange={() => handleSpecializationChange(spec)}
                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                          />
                          <span className="ml-2 text-sm text-slate-700">{spec}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      By submitting this application, you agree to our Partner Agreement and
                      acknowledge that you have read our terms and conditions.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={loading}
                  >
                    Previous
                  </Button>
                )}

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={loading}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
