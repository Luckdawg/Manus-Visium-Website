import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";

type DealStep = "customer" | "product" | "details" | "review" | "success";

interface DealFormData {
  // Customer Info
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany: string;
  customerIndustry: string;
  
  // Product Info
  productCategory: string;
  productName: string;
  productVersion: string;
  
  // Deal Details
  dealName: string;
  dealAmount: number;
  dealStage: string;
  expectedCloseDate: string;
  dealDescription: string;
  
  // Additional Info
  partnerNotes: string;
  mdfRequested: number;
}

const PRODUCT_CATEGORIES = [
  "TruContext Platform",
  "TruContext - Cybersecurity",
  "TruContext - Smart Cities",
  "TruContext - Critical Infrastructure",
  "TruContext - Healthcare",
  "TruContext - Financial Services",
  "TruContext - Supply Chain",
  "TruContext - Telecommunications",
  "TruContext - Manufacturing",
];

const DEAL_STAGES = [
  "Prospect",
  "Qualification",
  "Proposal",
  "Negotiation",
  "Closing",
];

const INDUSTRIES = [
  "Cybersecurity",
  "Smart Cities",
  "Critical Infrastructure",
  "Healthcare",
  "Financial Services",
  "Supply Chain",
  "Telecommunications",
  "Manufacturing",
  "Government",
  "Other",
];

export default function DealRegistrationWizard() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<DealStep>("customer");
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  
  const [formData, setFormData] = useState<DealFormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerCompany: "",
    customerIndustry: "",
    productCategory: "TruContext Platform",
    productName: "",
    productVersion: "",
    dealName: "",
    dealAmount: 0,

    dealStage: "Prospect",
    expectedCloseDate: "",
    dealDescription: "",
    partnerNotes: "",
    mdfRequested: 0,
  });

  const createDealMutation = trpc.partner.createDeal.useMutation();

  useEffect(() => {
    const sessionId = localStorage.getItem('partnerSessionId');
    if (sessionId) {
      setPartnerId(parseInt(sessionId, 10));
    } else {
      navigate("/partners/login");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const actualValue = type === "number" ? parseFloat(value) : value;
    
    setFormData((prev) => ({ ...prev, [name]: actualValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step: DealStep): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === "customer") {
      if (!formData.customerName) newErrors.customerName = "Customer name is required";
      if (!formData.customerEmail) newErrors.customerEmail = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) newErrors.customerEmail = "Invalid email";
      if (!formData.customerCompany) newErrors.customerCompany = "Company name is required";
      if (!formData.customerIndustry) newErrors.customerIndustry = "Industry is required";
    } else if (step === "product") {
      if (!formData.productName) newErrors.productName = "Product name is required";
    } else if (step === "details") {
      if (!formData.dealName) newErrors.dealName = "Deal name is required";
      if (formData.dealAmount <= 0) newErrors.dealValue = "Deal value must be greater than 0";
      if (!formData.expectedCloseDate) newErrors.expectedCloseDate = "Expected close date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    const steps: DealStep[] = ["customer", "product", "details", "review"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const steps: DealStep[] = ["customer", "product", "details", "review"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep("details")) return;
    if (!partnerId) {
      setApiError("Partner ID not found. Please log in again.");
      return;
    }

    try {
      await createDealMutation.mutateAsync({
        partnerId,
        dealName: formData.dealName,
        dealAmount: formData.dealAmount,
        dealStage: formData.dealStage,
        expectedCloseDate: formData.expectedCloseDate,
        description: formData.dealDescription,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerCompany: formData.customerCompany,
        productInterest: formData.productCategory,
        notes: formData.partnerNotes,
        mdfRequested: formData.mdfRequested,
      });

      setCurrentStep("success");
    } catch (error: any) {
      setApiError(error.message || "Failed to create deal. Please try again.");
    }
  };

  if (!partnerId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (currentStep === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 flex items-center">
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Deal Submitted Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your deal has been registered and is now pending review by our team. You'll receive updates via email.
              </p>
              <div className="space-y-3">
                <Button onClick={() => navigate("/partners/dashboard")} className="w-full">
                  Back to Dashboard
                </Button>
                <Button onClick={() => {
                  setCurrentStep("customer");
                  setFormData({
                    customerName: "",
                    customerEmail: "",
                    customerPhone: "",
                    customerCompany: "",
                    customerIndustry: "",
                    productCategory: "TruContext Platform",
                    productName: "",
                    productVersion: "",
                    dealName: "",
                    dealAmount: 0,
                
                    dealStage: "Prospect",
                    expectedCloseDate: "",
                    dealDescription: "",
                    partnerNotes: "",
                    mdfRequested: 0,
                  });
                }} variant="outline" className="w-full">
                  Submit Another Deal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            <div className={`flex items-center ${currentStep === "customer" || ["product", "details", "review"].includes(currentStep) ? "text-primary" : "text-gray-400"}`}>
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</div>
              <span className="ml-2 text-sm font-medium">Customer</span>
            </div>
            <div className={`flex items-center ${["product", "details", "review"].includes(currentStep) ? "text-primary" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full ${["product", "details", "review"].includes(currentStep) ? "bg-primary text-white" : "bg-gray-200"} flex items-center justify-center text-sm font-bold`}>2</div>
              <span className="ml-2 text-sm font-medium">Product</span>
            </div>
            <div className={`flex items-center ${["details", "review"].includes(currentStep) ? "text-primary" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full ${["details", "review"].includes(currentStep) ? "bg-primary text-white" : "bg-gray-200"} flex items-center justify-center text-sm font-bold`}>3</div>
              <span className="ml-2 text-sm font-medium">Details</span>
            </div>
            <div className={`flex items-center ${currentStep === "review" ? "text-primary" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full ${currentStep === "review" ? "bg-primary text-white" : "bg-gray-200"} flex items-center justify-center text-sm font-bold`}>4</div>
              <span className="ml-2 text-sm font-medium">Review</span>
            </div>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(["customer", "product", "details", "review"].indexOf(currentStep) + 1) * 25}%` }}
            />
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
            <CardTitle>
              {currentStep === "customer" && "Customer Information"}
              {currentStep === "product" && "Product Information"}
              {currentStep === "details" && "Deal Details"}
              {currentStep === "review" && "Review & Submit"}
            </CardTitle>
            <CardDescription className="text-white/90">
              {currentStep === "customer" && "Tell us about your customer"}
              {currentStep === "product" && "Select the product and version"}
              {currentStep === "details" && "Provide deal specifics"}
              {currentStep === "review" && "Review your deal information"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            )}

            {/* Customer Step */}
            {currentStep === "customer" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                      errors.customerName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.customerName && <p className="text-xs text-red-600 mt-1">{errors.customerName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                        errors.customerEmail ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="john@company.com"
                    />
                    {errors.customerEmail && <p className="text-xs text-red-600 mt-1">{errors.customerEmail}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    name="customerCompany"
                    value={formData.customerCompany}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                      errors.customerCompany ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Acme Corporation"
                  />
                  {errors.customerCompany && <p className="text-xs text-red-600 mt-1">{errors.customerCompany}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                  <select
                    name="customerIndustry"
                    value={formData.customerIndustry}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                      errors.customerIndustry ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select an industry</option>
                    {INDUSTRIES.map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                  {errors.customerIndustry && <p className="text-xs text-red-600 mt-1">{errors.customerIndustry}</p>}
                </div>
              </div>
            )}

            {/* Product Step */}
            {currentStep === "product" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Category *</label>
                  <select
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  >
                    {PRODUCT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                      errors.productName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., TruContext Enterprise Edition"
                  />
                  {errors.productName && <p className="text-xs text-red-600 mt-1">{errors.productName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Version</label>
                  <input
                    type="text"
                    name="productVersion"
                    value={formData.productVersion}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="e.g., 4.2.1"
                  />
                </div>
              </div>
            )}

            {/* Details Step */}
            {currentStep === "details" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deal Name *</label>
                  <input
                    type="text"
                    name="dealName"
                    value={formData.dealName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                      errors.dealName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Acme Corp - Cybersecurity Platform"
                  />
                  {errors.dealName && <p className="text-xs text-red-600 mt-1">{errors.dealName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deal Value *</label>
                    <input
                      type="number"
                      name="dealValue"
                      value={formData.dealAmount}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                        errors.dealValue ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="250000"
                    />
                    {errors.dealValue && <p className="text-xs text-red-600 mt-1">{errors.dealValue}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Close Date *</label>
                    <input
                      type="date"
                      name="expectedCloseDate"
                      value={formData.expectedCloseDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                        errors.expectedCloseDate ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.expectedCloseDate && <p className="text-xs text-red-600 mt-1">{errors.expectedCloseDate}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deal Description</label>
                  <textarea
                    name="dealDescription"
                    value={formData.dealDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Describe the deal, customer needs, and solution fit..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">MDF Requested ($)</label>
                    <input
                      type="number"
                      name="mdfRequested"
                      value={formData.mdfRequested}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Partner Notes</label>
                    <input
                      type="text"
                      name="partnerNotes"
                      value={formData.partnerNotes}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="Internal notes..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Review Step */}
            {currentStep === "review" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600">Customer Name</p>
                      <p className="font-medium">{formData.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="font-medium">{formData.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Company</p>
                      <p className="font-medium">{formData.customerCompany}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Industry</p>
                      <p className="font-medium">{formData.customerIndustry}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Product Information</h3>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600">Product Category</p>
                      <p className="font-medium">{formData.productCategory}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Product Name</p>
                      <p className="font-medium">{formData.productName}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Deal Details</h3>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600">Deal Name</p>
                      <p className="font-medium">{formData.dealName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Deal Value</p>
                      <p className="font-medium">${formData.dealAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Deal Stage</p>
                      <p className="font-medium">{formData.dealStage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Expected Close Date</p>
                      <p className="font-medium">{formData.expectedCloseDate}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-600">MDF Requested</p>
                      <p className="font-medium">${formData.mdfRequested.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentStep === "customer"}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {currentStep !== "review" ? (
                <Button
                  onClick={handleNext}
                  className="flex-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={createDealMutation.isPending}
                  className="flex-1"
                >
                  {createDealMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Deal"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
