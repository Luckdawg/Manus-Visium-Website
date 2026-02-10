import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Upload, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

interface DealFormData {
  // Opportunity details
  opportunityName: string;
  opportunityDescription: string;
  useCase: string;
  
  // Customer company information
  customerCompanyName: string;
  customerCountry: string;
  customerRegion: string;
  customerCity: string;
  customerState: string;
  customerIndustry: string;
  
  // Customer contact
  customerContactName: string;
  customerContactTitle: string;
  customerContactEmail: string;
  customerContactPhone: string;
  
  // Products/solutions
  productSKU: string;
  solutionType: string;
  
  // Deal value
  totalContractValue: string;
  currency: string;
  softwareValue: string;
  servicesValue: string;
  
  // Timeline
  estimatedCloseDate: string;
  contractStartDate: string;
  contractEndDate: string;
  
  // Partner contact (AE)
  partnerAEName: string;
  partnerAEEmail: string;
  partnerAEPhone: string;
  
  // Qualification
  budgetConfirmed: boolean;
  decisionMakerIdentified: boolean;
  competitiveLandscape: string;
  qualificationNotes: string;
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  url?: string;
}

const STEPS = [
  { id: 1, title: "Opportunity Details", description: "Basic opportunity information" },
  { id: 2, title: "Customer Information", description: "Customer company and contact details" },
  { id: 3, title: "Products & Value", description: "Products/solutions and deal value" },
  { id: 4, title: "Timeline & Partner", description: "Deal timeline and partner contact" },
  { id: 5, title: "Qualification", description: "Deal qualification checklist" },
  { id: 6, title: "Documents & Review", description: "Upload documents and review" },
];

export default function EnhancedRegisterDeal() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [formData, setFormData] = useState<DealFormData>({
    opportunityName: "",
    opportunityDescription: "",
    useCase: "",
    customerCompanyName: "",
    customerCountry: "",
    customerRegion: "",
    customerCity: "",
    customerState: "",
    customerIndustry: "",
    customerContactName: "",
    customerContactTitle: "",
    customerContactEmail: "",
    customerContactPhone: "",
    productSKU: "",
    solutionType: "",
    totalContractValue: "",
    currency: "USD",
    softwareValue: "",
    servicesValue: "",
    estimatedCloseDate: "",
    contractStartDate: "",
    contractEndDate: "",
    partnerAEName: "",
    partnerAEEmail: "",
    partnerAEPhone: "",
    budgetConfirmed: false,
    decisionMakerIdentified: false,
    competitiveLandscape: "",
    qualificationNotes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof DealFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.opportunityName.trim()) newErrors.opportunityName = "Opportunity name is required";
        if (!formData.opportunityDescription.trim()) newErrors.opportunityDescription = "Description is required";
        if (!formData.useCase.trim()) newErrors.useCase = "Use case is required";
        break;
      case 2:
        if (!formData.customerCompanyName.trim()) newErrors.customerCompanyName = "Company name is required";
        if (!formData.customerCountry.trim()) newErrors.customerCountry = "Country is required";
        if (!formData.customerCity.trim()) newErrors.customerCity = "City is required";
        if (!formData.customerContactName.trim()) newErrors.customerContactName = "Contact name is required";
        if (!formData.customerContactEmail.trim()) newErrors.customerContactEmail = "Contact email is required";
        if (!formData.customerContactPhone.trim()) newErrors.customerContactPhone = "Contact phone is required";
        break;
      case 3:
        if (!formData.productSKU.trim()) newErrors.productSKU = "Product SKU is required";
        if (!formData.totalContractValue) newErrors.totalContractValue = "Deal value is required";
        if (parseFloat(formData.totalContractValue) <= 0) newErrors.totalContractValue = "Deal value must be greater than 0";
        break;
      case 4:
        if (!formData.estimatedCloseDate) newErrors.estimatedCloseDate = "Estimated close date is required";
        if (!formData.partnerAEName.trim()) newErrors.partnerAEName = "Partner AE name is required";
        if (!formData.partnerAEEmail.trim()) newErrors.partnerAEEmail = "Partner AE email is required";
        break;
      case 5:
        if (!formData.competitiveLandscape.trim()) newErrors.competitiveLandscape = "Competitive landscape is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, fileSize: "File size must be less than 10MB" }));
        continue;
      }

      const newFile: UploadedFile = {
        name: file.name,
        type: file.type,
        size: file.size,
      };
      setUploadedFiles(prev => [...prev, newFile]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      // TODO: Submit deal to backend
      console.log("Submitting deal:", { formData, files: uploadedFiles });
      navigate("/partners/deals");
    } catch (error) {
      console.error("Error submitting deal:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="opportunityName">Opportunity Name *</Label>
              <Input
                id="opportunityName"
                value={formData.opportunityName}
                onChange={(e) => handleInputChange("opportunityName", e.target.value)}
                placeholder="e.g., TruContext Platform Implementation"
                className={errors.opportunityName ? "border-red-500" : ""}
              />
              {errors.opportunityName && <p className="text-sm text-red-500 mt-1">{errors.opportunityName}</p>}
            </div>

            <div>
              <Label htmlFor="opportunityDescription">Opportunity Description *</Label>
              <Textarea
                id="opportunityDescription"
                value={formData.opportunityDescription}
                onChange={(e) => handleInputChange("opportunityDescription", e.target.value)}
                placeholder="Describe the opportunity..."
                className={errors.opportunityDescription ? "border-red-500" : ""}
              />
              {errors.opportunityDescription && <p className="text-sm text-red-500 mt-1">{errors.opportunityDescription}</p>}
            </div>

            <div>
              <Label htmlFor="useCase">Use Case *</Label>
              <Textarea
                id="useCase"
                value={formData.useCase}
                onChange={(e) => handleInputChange("useCase", e.target.value)}
                placeholder="What is the customer trying to achieve?"
                className={errors.useCase ? "border-red-500" : ""}
              />
              {errors.useCase && <p className="text-sm text-red-500 mt-1">{errors.useCase}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerCompanyName">Customer Company Name *</Label>
                <Input
                  id="customerCompanyName"
                  value={formData.customerCompanyName}
                  onChange={(e) => handleInputChange("customerCompanyName", e.target.value)}
                  placeholder="Company name"
                  className={errors.customerCompanyName ? "border-red-500" : ""}
                />
                {errors.customerCompanyName && <p className="text-sm text-red-500 mt-1">{errors.customerCompanyName}</p>}
              </div>

              <div>
                <Label htmlFor="customerIndustry">Industry</Label>
                <Input
                  id="customerIndustry"
                  value={formData.customerIndustry}
                  onChange={(e) => handleInputChange("customerIndustry", e.target.value)}
                  placeholder="e.g., Financial Services"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerCountry">Country *</Label>
                <Input
                  id="customerCountry"
                  value={formData.customerCountry}
                  onChange={(e) => handleInputChange("customerCountry", e.target.value)}
                  placeholder="Country"
                  className={errors.customerCountry ? "border-red-500" : ""}
                />
                {errors.customerCountry && <p className="text-sm text-red-500 mt-1">{errors.customerCountry}</p>}
              </div>

              <div>
                <Label htmlFor="customerRegion">Region</Label>
                <Input
                  id="customerRegion"
                  value={formData.customerRegion}
                  onChange={(e) => handleInputChange("customerRegion", e.target.value)}
                  placeholder="Region"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerCity">City *</Label>
                <Input
                  id="customerCity"
                  value={formData.customerCity}
                  onChange={(e) => handleInputChange("customerCity", e.target.value)}
                  placeholder="City"
                  className={errors.customerCity ? "border-red-500" : ""}
                />
                {errors.customerCity && <p className="text-sm text-red-500 mt-1">{errors.customerCity}</p>}
              </div>

              <div>
                <Label htmlFor="customerState">State/Province</Label>
                <Input
                  id="customerState"
                  value={formData.customerState}
                  onChange={(e) => handleInputChange("customerState", e.target.value)}
                  placeholder="State"
                />
              </div>
            </div>

            <hr className="my-4" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerContactName">Contact Name *</Label>
                <Input
                  id="customerContactName"
                  value={formData.customerContactName}
                  onChange={(e) => handleInputChange("customerContactName", e.target.value)}
                  placeholder="Full name"
                  className={errors.customerContactName ? "border-red-500" : ""}
                />
                {errors.customerContactName && <p className="text-sm text-red-500 mt-1">{errors.customerContactName}</p>}
              </div>

              <div>
                <Label htmlFor="customerContactTitle">Title</Label>
                <Input
                  id="customerContactTitle"
                  value={formData.customerContactTitle}
                  onChange={(e) => handleInputChange("customerContactTitle", e.target.value)}
                  placeholder="Job title"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerContactEmail">Email *</Label>
                <Input
                  id="customerContactEmail"
                  type="email"
                  value={formData.customerContactEmail}
                  onChange={(e) => handleInputChange("customerContactEmail", e.target.value)}
                  placeholder="email@example.com"
                  className={errors.customerContactEmail ? "border-red-500" : ""}
                />
                {errors.customerContactEmail && <p className="text-sm text-red-500 mt-1">{errors.customerContactEmail}</p>}
              </div>

              <div>
                <Label htmlFor="customerContactPhone">Phone *</Label>
                <Input
                  id="customerContactPhone"
                  value={formData.customerContactPhone}
                  onChange={(e) => handleInputChange("customerContactPhone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={errors.customerContactPhone ? "border-red-500" : ""}
                />
                {errors.customerContactPhone && <p className="text-sm text-red-500 mt-1">{errors.customerContactPhone}</p>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productSKU">Product SKU *</Label>
                <Input
                  id="productSKU"
                  value={formData.productSKU}
                  onChange={(e) => handleInputChange("productSKU", e.target.value)}
                  placeholder="e.g., TC-ENTERPRISE-001"
                  className={errors.productSKU ? "border-red-500" : ""}
                />
                {errors.productSKU && <p className="text-sm text-red-500 mt-1">{errors.productSKU}</p>}
              </div>

              <div>
                <Label htmlFor="solutionType">Solution Type</Label>
                <Input
                  id="solutionType"
                  value={formData.solutionType}
                  onChange={(e) => handleInputChange("solutionType", e.target.value)}
                  placeholder="e.g., Cybersecurity"
                />
              </div>
            </div>

            <hr className="my-4" />

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="totalContractValue">Total Contract Value *</Label>
                <Input
                  id="totalContractValue"
                  type="number"
                  value={formData.totalContractValue}
                  onChange={(e) => handleInputChange("totalContractValue", e.target.value)}
                  placeholder="0.00"
                  className={errors.totalContractValue ? "border-red-500" : ""}
                />
                {errors.totalContractValue && <p className="text-sm text-red-500 mt-1">{errors.totalContractValue}</p>}
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="softwareValue">Software Value</Label>
                <Input
                  id="softwareValue"
                  type="number"
                  value={formData.softwareValue}
                  onChange={(e) => handleInputChange("softwareValue", e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="servicesValue">Services Value</Label>
              <Input
                id="servicesValue"
                type="number"
                value={formData.servicesValue}
                onChange={(e) => handleInputChange("servicesValue", e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="estimatedCloseDate">Estimated Close Date *</Label>
              <Input
                id="estimatedCloseDate"
                type="date"
                value={formData.estimatedCloseDate}
                onChange={(e) => handleInputChange("estimatedCloseDate", e.target.value)}
                className={errors.estimatedCloseDate ? "border-red-500" : ""}
              />
              {errors.estimatedCloseDate && <p className="text-sm text-red-500 mt-1">{errors.estimatedCloseDate}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contractStartDate">Contract Start Date</Label>
                <Input
                  id="contractStartDate"
                  type="date"
                  value={formData.contractStartDate}
                  onChange={(e) => handleInputChange("contractStartDate", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="contractEndDate">Contract End Date</Label>
                <Input
                  id="contractEndDate"
                  type="date"
                  value={formData.contractEndDate}
                  onChange={(e) => handleInputChange("contractEndDate", e.target.value)}
                />
              </div>
            </div>

            <hr className="my-4" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="partnerAEName">Partner Account Executive Name *</Label>
                <Input
                  id="partnerAEName"
                  value={formData.partnerAEName}
                  onChange={(e) => handleInputChange("partnerAEName", e.target.value)}
                  placeholder="Full name"
                  className={errors.partnerAEName ? "border-red-500" : ""}
                />
                {errors.partnerAEName && <p className="text-sm text-red-500 mt-1">{errors.partnerAEName}</p>}
              </div>

              <div>
                <Label htmlFor="partnerAEEmail">Partner AE Email *</Label>
                <Input
                  id="partnerAEEmail"
                  type="email"
                  value={formData.partnerAEEmail}
                  onChange={(e) => handleInputChange("partnerAEEmail", e.target.value)}
                  placeholder="email@example.com"
                  className={errors.partnerAEEmail ? "border-red-500" : ""}
                />
                {errors.partnerAEEmail && <p className="text-sm text-red-500 mt-1">{errors.partnerAEEmail}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="partnerAEPhone">Partner AE Phone</Label>
              <Input
                id="partnerAEPhone"
                value={formData.partnerAEPhone}
                onChange={(e) => handleInputChange("partnerAEPhone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="budgetConfirmed"
                  checked={formData.budgetConfirmed}
                  onCheckedChange={(checked) => handleInputChange("budgetConfirmed", checked)}
                />
                <Label htmlFor="budgetConfirmed" className="cursor-pointer">Budget Confirmed</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="decisionMakerIdentified"
                  checked={formData.decisionMakerIdentified}
                  onCheckedChange={(checked) => handleInputChange("decisionMakerIdentified", checked)}
                />
                <Label htmlFor="decisionMakerIdentified" className="cursor-pointer">Decision Maker Identified</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="competitiveLandscape">Competitive Landscape *</Label>
              <Textarea
                id="competitiveLandscape"
                value={formData.competitiveLandscape}
                onChange={(e) => handleInputChange("competitiveLandscape", e.target.value)}
                placeholder="Describe the competitive situation..."
                className={errors.competitiveLandscape ? "border-red-500" : ""}
              />
              {errors.competitiveLandscape && <p className="text-sm text-red-500 mt-1">{errors.competitiveLandscape}</p>}
            </div>

            <div>
              <Label htmlFor="qualificationNotes">Qualification Notes</Label>
              <Textarea
                id="qualificationNotes"
                value={formData.qualificationNotes}
                onChange={(e) => handleInputChange("qualificationNotes", e.target.value)}
                placeholder="Additional qualification information..."
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label>Upload Supporting Documents</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileInput"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, DOC, XLS, PPT, images (max 10MB)</p>
                </label>
              </div>
              {errors.fileSize && <p className="text-sm text-red-500 mt-1">{errors.fileSize}</p>}
            </div>

            {uploadedFiles.length > 0 && (
              <div>
                <Label>Uploaded Files ({uploadedFiles.length})</Label>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Review Your Deal</p>
                  <p className="text-sm text-blue-800 mt-1">Please review all information before submitting. You can go back to edit any section.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const completionPercentage = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Register a Deal</h1>
          <p className="text-gray-600">Submit a new opportunity for review</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {STEPS.map((step) => (
              <div key={step.id} className="flex-1">
                <div
                  className={`h-2 rounded-full ${
                    step.id <= currentStep ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Step {currentStep} of {STEPS.length}
          </p>
        </div>

        {/* Steps Navigation */}
        <div className="mb-8 grid grid-cols-6 gap-2">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`p-3 rounded-lg text-center transition-all ${
                step.id === currentStep
                  ? "bg-primary text-white"
                  : step.id < currentStep
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <div className="text-sm font-medium">{step.id}</div>
              <div className="text-xs">{step.title}</div>
            </button>
          ))}
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep === STEPS.length ? (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit Deal
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
