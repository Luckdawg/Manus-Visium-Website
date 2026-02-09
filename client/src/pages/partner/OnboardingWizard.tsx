import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

interface OnboardingData {
  // Step 1: Company Info
  companyName: string;
  website: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;

  // Step 2: Partner Type
  partnerType: string;

  // Step 3: Commission Tier
  tier: string;

  // Step 4: MDF Budget
  mdfBudgetAnnual: string;

  // Step 5: Contact Info
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
}

const STEPS = [
  { id: 1, title: "Company Information", description: "Tell us about your organization" },
  { id: 2, title: "Partner Type", description: "Select your partnership category" },
  { id: 3, title: "Commission Tier", description: "Choose your commission level" },
  { id: 4, title: "MDF Budget", description: "Set your annual MDF allocation" },
  { id: 5, title: "Contact Information", description: "Primary contact details" },
  { id: 6, title: "Review & Confirm", description: "Verify your information" },
];

const PARTNER_TYPES = [
  "Reseller",
  "Technology Partner",
  "System Integrator",
  "Managed Service Provider",
  "Consulting Partner",
  "Channel Partner",
  "OEM Partner",
  "Other",
];

const TIERS = [
  { value: "Gold", label: "Gold", description: "20% commission, $50K MDF" },
  { value: "Silver", label: "Silver", description: "15% commission, $25K MDF" },
  { value: "Bronze", label: "Bronze", description: "10% commission, $10K MDF" },
  { value: "Standard", label: "Standard", description: "5% commission, $5K MDF" },
];

export default function OnboardingWizard() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<OnboardingData>({
    companyName: "",
    website: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    partnerType: "",
    tier: "",
    mdfBudgetAnnual: "",
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
  });

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.country.trim()) newErrors.country = "Country is required";
      if (!formData.zipCode.trim()) newErrors.zipCode = "Zip code is required";
    } else if (step === 2) {
      if (!formData.partnerType) newErrors.partnerType = "Partner type is required";
    } else if (step === 3) {
      if (!formData.tier) newErrors.tier = "Commission tier is required";
    } else if (step === 4) {
      if (!formData.mdfBudgetAnnual) newErrors.mdfBudgetAnnual = "MDF budget is required";
      if (formData.mdfBudgetAnnual && isNaN(Number(formData.mdfBudgetAnnual))) {
        newErrors.mdfBudgetAnnual = "MDF budget must be a number";
      }
    } else if (step === 5) {
      if (!formData.primaryContactName.trim()) newErrors.primaryContactName = "Contact name is required";
      if (!formData.primaryContactEmail.trim()) newErrors.primaryContactEmail = "Email is required";
      if (formData.primaryContactEmail && !formData.primaryContactEmail.includes("@")) {
        newErrors.primaryContactEmail = "Invalid email address";
      }
      if (!formData.primaryContactPhone.trim()) newErrors.primaryContactPhone = "Phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleComplete = () => {
    if (validateStep(currentStep)) {
      // TODO: Submit data to backend
      console.log("Onboarding complete:", formData);
      navigate("/partners/dashboard", { replace: true });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Your company name"
                  className={errors.companyName ? "border-red-500" : ""}
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Street address"
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="City"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="State/Province"
                  className={errors.state ? "border-red-500" : ""}
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="Country"
                  className={errors.country ? "border-red-500" : ""}
                />
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  placeholder="Postal code"
                  className={errors.zipCode ? "border-red-500" : ""}
                />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">Select the category that best describes your partnership</p>
            <div className="grid md:grid-cols-2 gap-4">
              {PARTNER_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleInputChange("partnerType", type)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.partnerType === type
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  <p className="font-semibold">{type}</p>
                </button>
              ))}
            </div>
            {errors.partnerType && <p className="text-red-500 text-sm">{errors.partnerType}</p>}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">Choose your commission tier</p>
            <div className="grid md:grid-cols-2 gap-4">
              {TIERS.map((tier) => (
                <button
                  key={tier.value}
                  onClick={() => handleInputChange("tier", tier.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.tier === tier.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  <p className="font-semibold">{tier.label}</p>
                  <p className="text-sm text-gray-600">{tier.description}</p>
                </button>
              ))}
            </div>
            {errors.tier && <p className="text-red-500 text-sm">{errors.tier}</p>}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="mdfBudget">Annual MDF Budget ($) *</Label>
              <Input
                id="mdfBudget"
                type="number"
                value={formData.mdfBudgetAnnual}
                onChange={(e) => handleInputChange("mdfBudgetAnnual", e.target.value)}
                placeholder="50000"
                className={errors.mdfBudgetAnnual ? "border-red-500" : ""}
              />
              {errors.mdfBudgetAnnual && <p className="text-red-500 text-sm mt-1">{errors.mdfBudgetAnnual}</p>}
              <p className="text-sm text-gray-600 mt-2">
                This is your annual Marketing Development Fund allocation for co-marketing activities
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={formData.primaryContactName}
                  onChange={(e) => handleInputChange("primaryContactName", e.target.value)}
                  placeholder="Full name"
                  className={errors.primaryContactName ? "border-red-500" : ""}
                />
                {errors.primaryContactName && (
                  <p className="text-red-500 text-sm mt-1">{errors.primaryContactName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.primaryContactEmail}
                  onChange={(e) => handleInputChange("primaryContactEmail", e.target.value)}
                  placeholder="email@example.com"
                  className={errors.primaryContactEmail ? "border-red-500" : ""}
                />
                {errors.primaryContactEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.primaryContactEmail}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="contactPhone">Phone *</Label>
              <Input
                id="contactPhone"
                value={formData.primaryContactPhone}
                onChange={(e) => handleInputChange("primaryContactPhone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={errors.primaryContactPhone ? "border-red-500" : ""}
              />
              {errors.primaryContactPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.primaryContactPhone}</p>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Review Your Information</h3>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Company Name</p>
                    <p className="font-semibold">{formData.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Partner Type</p>
                    <p className="font-semibold">{formData.partnerType}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Commission Tier</p>
                    <p className="font-semibold">{formData.tier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Annual MDF Budget</p>
                    <p className="font-semibold">${Number(formData.mdfBudgetAnnual).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Primary Contact</p>
                    <p className="font-semibold">{formData.primaryContactName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{formData.primaryContactEmail}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold">
                    {formData.address}, {formData.city}, {formData.state} {formData.zipCode}, {formData.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                ✓ All information has been verified. Click "Complete Onboarding" to activate your partner account.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const step = STEPS[currentStep - 1];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                    s.id < currentStep
                      ? "bg-green-500 text-white"
                      : s.id === currentStep
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s.id < currentStep ? <CheckCircle2 className="h-6 w-6" /> : s.id}
                </div>
                <p className="text-xs text-center max-w-[60px] text-gray-600">{s.title}</p>
              </div>
            ))}
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{step?.title}</CardTitle>
            <p className="text-gray-600 mt-2">{step?.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep === STEPS.length ? (
                <Button onClick={handleComplete} className="gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Complete Onboarding
                </Button>
              ) : (
                <Button onClick={handleNext} className="gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
