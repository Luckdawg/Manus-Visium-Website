import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

const PRODUCT_CATEGORIES = [
  "Cybersecurity",
  "Cloud Computing",
  "Data Analytics",
  "AI/Machine Learning",
  "Network Infrastructure",
  "Identity & Access",
  "Threat Intelligence",
  "Compliance & Governance",
];

const DEAL_STAGES = [
  "Prospecting",
  "Qualification",
  "Needs Analysis",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

export default function DealWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    dealName: "",
    dealAmount: 0,
    dealCurrency: "USD",
    dealStage: "Prospecting",
    expectedCloseDate: "",
    dealDescription: "",
    customerName: "",
    customerEmail: "",
    customerCompany: "",
    productCategory: "",
    partnerNotes: "",
    mdfRequested: 0,
  });

  const createDealMutation = trpc.partner.createDeal.useMutation();
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "dealAmount" || name === "mdfRequested" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async () => {
    const partnerId = localStorage.getItem("partnerId");
    if (!partnerId) {
      alert("Partner ID not found. Please log in again.");
      return;
    }

    try {
      await createDealMutation.mutateAsync({
        partnerId: parseInt(partnerId),
        ...formData,
      });
      setSubmitted(true);
      setTimeout(() => {
        setStep(1);
        setFormData({
          dealName: "",
          dealAmount: 0,
          dealCurrency: "USD",
          dealStage: "Prospecting",
          expectedCloseDate: "",
          dealDescription: "",
          customerName: "",
          customerEmail: "",
          customerCompany: "",
          productCategory: "",
          partnerNotes: "",
          mdfRequested: 0,
        });
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      alert("Failed to create deal: " + (error as any).message);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Deal Submitted!</h2>
            <p className="text-gray-600">Your deal has been submitted for review. Our team will contact you soon.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit a New Deal</h1>
          <p className="text-gray-600">Complete the steps below to register your deal</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                    step >= s
                      ? "bg-primary text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition ${
                      step > s ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Deal Info</span>
            <span>Customer</span>
            <span>Products</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
            <CardTitle>
              {step === 1 && "Deal Information"}
              {step === 2 && "Customer Details"}
              {step === 3 && "Product & Resources"}
              {step === 4 && "Review & Submit"}
            </CardTitle>
            <CardDescription className="text-white/90">
              {step === 1 && "Enter the basic details about your deal"}
              {step === 2 && "Provide information about the customer"}
              {step === 3 && "Select product category and request resources"}
              {step === 4 && "Review your deal information before submitting"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            {/* Step 1: Deal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deal Name *</label>
                  <input
                    type="text"
                    name="dealName"
                    value={formData.dealName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="e.g., Acme Corp Security Upgrade"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deal Value *</label>
                    <input
                      type="number"
                      name="dealAmount"
                      value={formData.dealAmount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      name="dealCurrency"
                      value={formData.dealCurrency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    >
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deal Stage *</label>
                    <select
                      name="dealStage"
                      value={formData.dealStage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    >
                      {DEAL_STAGES.map((stage) => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Close Date</label>
                    <input
                      type="date"
                      name="expectedCloseDate"
                      value={formData.expectedCloseDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deal Description</label>
                  <textarea
                    name="dealDescription"
                    value={formData.dealDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Describe the deal, opportunity, and key details..."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Customer Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="e.g., John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email *</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Company *</label>
                  <input
                    type="text"
                    name="customerCompany"
                    value={formData.customerCompany}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="e.g., Acme Corporation"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Products & Resources */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Category *</label>
                  <select
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="">Select a category...</option>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">MDF Requested</label>
                  <input
                    type="number"
                    name="mdfRequested"
                    value={formData.mdfRequested}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Marketing Development Funds requested for this deal</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partner Notes</label>
                  <textarea
                    name="partnerNotes"
                    value={formData.partnerNotes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Add any additional notes or requirements..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Deal Name</p>
                      <p className="font-semibold text-gray-900">{formData.dealName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Deal Value</p>
                      <p className="font-semibold text-gray-900">${formData.dealAmount.toLocaleString()} {formData.dealCurrency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Customer</p>
                      <p className="font-semibold text-gray-900">{formData.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Customer Company</p>
                      <p className="font-semibold text-gray-900">{formData.customerCompany}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Deal Stage</p>
                      <p className="font-semibold text-gray-900">{formData.dealStage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Product Category</p>
                      <p className="font-semibold text-gray-900">{formData.productCategory}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    ✓ Your deal will be reviewed by our team within 24 hours
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            variant="outline"
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {step < 4 ? (
            <Button
              onClick={() => setStep(Math.min(4, step + 1))}
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createDealMutation.isPending}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {createDealMutation.isPending ? "Submitting..." : "Submit Deal"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
