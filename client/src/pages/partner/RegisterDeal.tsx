import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, FileUp, Loader2 } from "lucide-react";

interface DealFormData {
  dealName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerIndustry: string;
  customerSize: "Startup" | "SMB" | "Mid-Market" | "Enterprise" | "Government" | "";
  dealAmount: string;
  dealStage: "Qualified Lead" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";
  expectedCloseDate: string;
  productInterest: string;
  description: string;
  partnerNotes: string;
  mdfRequested: string;
}

const INDUSTRIES = [
  "Cybersecurity",
  "Finance",
  "Healthcare",
  "Government",
  "Manufacturing",
  "Retail",
  "Technology",
  "Telecommunications",
  "Energy",
  "Transportation",
  "Education",
  "Other"
];

const CUSTOMER_SIZES = ["Startup", "SMB", "Mid-Market", "Enterprise", "Government"];

export default function RegisterDeal() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DealFormData>({
    dealName: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerIndustry: "",
    customerSize: "",
    dealAmount: "",
    dealStage: "Qualified Lead",
    expectedCloseDate: "",
    productInterest: "",
    description: "",
    partnerNotes: "",
    mdfRequested: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const submitDealMutation = trpc.partner.registerDeal.useMutation({
    onSuccess: () => {
      setSuccessMessage("Deal registered successfully!");
      setTimeout(() => navigate("/partners/deals"), 2000);
    },
    onError: (error: any) => {
      setErrors({ submit: error.message });
    }
  });

  const handleInputChange = (field: keyof DealFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.dealName.trim()) newErrors.dealName = "Deal name is required";
      if (!formData.customerName.trim()) newErrors.customerName = "Customer name is required";
      if (!formData.customerEmail.trim()) newErrors.customerEmail = "Customer email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
        newErrors.customerEmail = "Invalid email format";
      }
    }

    if (step === 2) {
      if (!formData.customerIndustry) newErrors.customerIndustry = "Industry is required";
      if (!formData.customerSize) newErrors.customerSize = "Customer size is required";
    }

    if (step === 3) {
      if (!formData.dealAmount.trim()) newErrors.dealAmount = "Deal amount is required";
      else if (isNaN(Number(formData.dealAmount))) newErrors.dealAmount = "Deal amount must be a number";
      if (!formData.expectedCloseDate) newErrors.expectedCloseDate = "Expected close date is required";
    }

    if (step === 4) {
      if (!formData.productInterest.trim()) newErrors.productInterest = "Product interest is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    submitDealMutation.mutate({
      partnerCompanyId: user?.id || 0,
      dealName: formData.dealName,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      dealAmount: formData.dealAmount,
      expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate) : undefined,
      description: formData.description,
      submittedBy: user?.id || 0
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">Please log in to register a deal.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Register a Deal</h1>
          <p className="text-muted-foreground">Submit your opportunity to Visium for evaluation and support</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <p className="text-green-800">{successMessage}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${
                  step <= currentStep
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {step}
                </div>
                <span className="text-xs text-center text-muted-foreground">
                  {step === 1 && "Deal Info"}
                  {step === 2 && "Customer"}
                  {step === 3 && "Details"}
                  {step === 4 && "Review"}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Deal Information"}
              {currentStep === 2 && "Customer Information"}
              {currentStep === 3 && "Deal Details"}
              {currentStep === 4 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about the deal opportunity"}
              {currentStep === 2 && "Provide customer details"}
              {currentStep === 3 && "Specify deal amount and timeline"}
              {currentStep === 4 && "Review and submit your deal"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Step 1: Deal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Deal Name *</label>
                  <Input
                    placeholder="e.g., Acme Corp Security Upgrade"
                    value={formData.dealName}
                    onChange={(e) => handleInputChange("dealName", e.target.value)}
                    className={errors.dealName ? "border-red-500" : ""}
                  />
                  {errors.dealName && <p className="text-red-500 text-sm mt-1">{errors.dealName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Customer Name *</label>
                  <Input
                    placeholder="Full company name"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    className={errors.customerName ? "border-red-500" : ""}
                  />
                  {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Customer Email *</label>
                  <Input
                    type="email"
                    placeholder="contact@customer.com"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                    className={errors.customerEmail ? "border-red-500" : ""}
                  />
                  {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Customer Phone</label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Customer Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Industry *</label>
                  <select
                    value={formData.customerIndustry}
                    onChange={(e) => handleInputChange("customerIndustry", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${errors.customerIndustry ? "border-red-500" : "border-input"}`}
                  >
                    <option value="">Select an industry</option>
                    {INDUSTRIES.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                  {errors.customerIndustry && <p className="text-red-500 text-sm mt-1">{errors.customerIndustry}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Customer Size *</label>
                  <select
                    value={formData.customerSize}
                    onChange={(e) => handleInputChange("customerSize", e.target.value as any)}
                    className={`w-full px-3 py-2 border rounded-md ${errors.customerSize ? "border-red-500" : "border-input"}`}
                  >
                    <option value="">Select company size</option>
                    {CUSTOMER_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  {errors.customerSize && <p className="text-red-500 text-sm mt-1">{errors.customerSize}</p>}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Tip:</strong> Providing accurate customer information helps us better support your deal and provide relevant resources.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Deal Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Deal Amount (USD) *</label>
                  <Input
                    type="number"
                    placeholder="100000"
                    value={formData.dealAmount}
                    onChange={(e) => handleInputChange("dealAmount", e.target.value)}
                    className={errors.dealAmount ? "border-red-500" : ""}
                  />
                  {errors.dealAmount && <p className="text-red-500 text-sm mt-1">{errors.dealAmount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expected Close Date *</label>
                  <Input
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={(e) => handleInputChange("expectedCloseDate", e.target.value)}
                    className={errors.expectedCloseDate ? "border-red-500" : ""}
                  />
                  {errors.expectedCloseDate && <p className="text-red-500 text-sm mt-1">{errors.expectedCloseDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Deal Stage</label>
                  <select
                    value={formData.dealStage}
                    onChange={(e) => handleInputChange("dealStage", e.target.value as any)}
                    className="w-full px-3 py-2 border border-input rounded-md"
                  >
                    <option value="Qualified Lead">Qualified Lead</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Interest *</label>
                  <Input
                    placeholder="e.g., TruContext Platform, Threat Intelligence"
                    value={formData.productInterest}
                    onChange={(e) => handleInputChange("productInterest", e.target.value)}
                    className={errors.productInterest ? "border-red-500" : ""}
                  />
                  {errors.productInterest && <p className="text-red-500 text-sm mt-1">{errors.productInterest}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Deal Description *</label>
                  <Textarea
                    placeholder="Provide details about the deal, customer needs, and why they're interested in our solutions"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={errors.description ? "border-red-500" : ""}
                    rows={4}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Summary */}
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deal:</span>
                    <span className="font-medium">{formData.dealName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="font-medium">{formData.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">${Number(formData.dealAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Close Date:</span>
                    <span className="font-medium">{new Date(formData.expectedCloseDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">{errors.submit}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          {/* Navigation Buttons */}
          <div className="px-6 py-4 border-t flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button onClick={handleNext} className="gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitDealMutation.isPending}
                className="gap-2"
              >
                {submitDealMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Submit Deal
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Help Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• <strong>Deal Amount:</strong> Estimated annual contract value (ACV) for the deal</p>
            <p>• <strong>Expected Close Date:</strong> When you expect the customer to make a decision</p>
            <p>• <strong>Product Interest:</strong> Which Visium products or solutions is the customer interested in?</p>
            <p>Questions? Contact your partner account manager or email <strong>partners@visiumtechnologies.com</strong></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
