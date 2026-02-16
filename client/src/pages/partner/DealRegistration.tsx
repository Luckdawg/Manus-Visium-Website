import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, X, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DealRegistration() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("customer");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Customer & Account Info
  const [customerCompanyName, setCustomerCompanyName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerIndustry, setCustomerIndustry] = useState("");
  const [customerSize, setCustomerSize] = useState("");

  // Opportunity/Deal Details
  const [dealName, setDealName] = useState("");
  const [dealDescription, setDealDescription] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [estimatedCloseDate, setEstimatedCloseDate] = useState("");
  const [salesStage, setSalesStage] = useState("Prospecting");
  const [dealType, setDealType] = useState("");
  const [productInterest, setProductInterest] = useState<string[]>([]);

  // Customer Contact Details
  const [primaryContactName, setPrimaryContactName] = useState("");
  const [primaryContactTitle, setPrimaryContactTitle] = useState("");
  const [primaryContactEmail, setPrimaryContactEmail] = useState("");
  const [primaryContactPhone, setPrimaryContactPhone] = useState("");

  // Partner & Seller Information
  const [partnerSalesRepName, setPartnerSalesRepName] = useState("");
  const [partnerSalesRepEmail, setPartnerSalesRepEmail] = useState("");
  const [partnerSalesRepPhone, setPartnerSalesRepPhone] = useState("");

  // Qualification & Program Fields
  const [qualificationNotes, setQualificationNotes] = useState("");
  const [opportunitySource, setOpportunitySource] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const toggleProductInterest = (product: string) => {
    setProductInterest((prev) =>
      prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]
    );
  };

  const submitDealMutation = trpc.partner.submitDeal.useMutation();

  const handleSubmit = async () => {
    // Validation
    if (!dealName || !customerCompanyName || !dealValue || !estimatedCloseDate) {
      setErrorMessage("Please fill in all required fields (marked with *)");
      return;
    }

    if (isNaN(parseFloat(dealValue)) || parseFloat(dealValue) <= 0) {
      setErrorMessage("Deal value must be a positive number");
      return;
    }

    // Validate date format
    const dateObj = new Date(estimatedCloseDate);
    if (isNaN(dateObj.getTime())) {
      setErrorMessage("Please enter a valid close date");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const dealData = {
        customerCompanyName,
        dealName,
        dealValue: parseFloat(dealValue),
        estimatedCloseDate,
        customerEmail: customerEmail || primaryContactEmail,
        customerPhone,
        customerIndustry,
        customerSize: customerSize as "Startup" | "SMB" | "Mid-Market" | "Enterprise" | "Government" | undefined,
        dealStage: salesStage as "Prospecting" | "Qualification" | "Needs Analysis" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost" | undefined,
        description: dealDescription,
        productInterest: productInterest.length > 0 ? productInterest : undefined,
      };

      const result = await submitDealMutation.mutateAsync(dealData);
      const dealId = result.dealId;
      
      setSuccessMessage("✓ Deal registration submitted successfully! Your deal is now pending admin approval.");
      
      // Clear form
      setTimeout(() => {
        navigate("/partners/dashboard");
      }, 2000);
    } catch (error: any) {
      const errorMsg = error?.message || "Error submitting deal registration";
      setErrorMessage(errorMsg);
      console.error("Deal submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/partners/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Register New Deal</h1>
            <p className="text-muted-foreground mt-1">Complete all sections to register your opportunity</p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="opportunity">Opportunity</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="partner">Partner</TabsTrigger>
            <TabsTrigger value="qualification">Qualification</TabsTrigger>
          </TabsList>

          {/* Customer & Account Info */}
          <TabsContent value="customer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer & Account Information</CardTitle>
                <CardDescription>Core customer and account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Customer Company Name *</label>
                    <Input
                      value={customerCompanyName}
                      onChange={(e) => setCustomerCompanyName(e.target.value)}
                      placeholder="Enter customer company name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Customer Email</label>
                    <Input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="customer@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Customer Phone</label>
                    <Input
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Industry</label>
                    <Select value={customerIndustry} onValueChange={setCustomerIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Financial Services">Financial Services</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Government">Government</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Smart Cities">Smart Cities</SelectItem>
                        <SelectItem value="Supply Chain">Supply Chain</SelectItem>
                        <SelectItem value="Telecommunications">Telecommunications</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Company Size</label>
                  <Select value={customerSize} onValueChange={setCustomerSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Startup">Startup</SelectItem>
                      <SelectItem value="SMB">SMB (50-500 employees)</SelectItem>
                      <SelectItem value="Mid-Market">Mid-Market (500-5,000 employees)</SelectItem>
                      <SelectItem value="Enterprise">Enterprise (5,000+ employees)</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Opportunity/Deal Details */}
          <TabsContent value="opportunity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Opportunity & Deal Details</CardTitle>
                <CardDescription>Specify the deal information and expected value</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Deal Name *</label>
                    <Input
                      value={dealName}
                      onChange={(e) => setDealName(e.target.value)}
                      placeholder="Enter deal name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deal Type</label>
                    <Select value={dealType} onValueChange={setDealType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select deal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New Business">New Business</SelectItem>
                        <SelectItem value="Expansion">Expansion</SelectItem>
                        <SelectItem value="Renewal">Renewal</SelectItem>
                        <SelectItem value="Upgrade">Upgrade</SelectItem>
                        <SelectItem value="Cross-sell">Cross-sell</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Deal Value (USD) *</label>
                    <Input
                      type="number"
                      value={dealValue}
                      onChange={(e) => setDealValue(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Estimated Close Date *</label>
                    <Input
                      type="date"
                      value={estimatedCloseDate}
                      onChange={(e) => setEstimatedCloseDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Sales Stage</label>
                  <Select value={salesStage} onValueChange={setSalesStage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prospecting">Prospecting</SelectItem>
                      <SelectItem value="Qualification">Qualification</SelectItem>
                      <SelectItem value="Needs Analysis">Needs Analysis</SelectItem>
                      <SelectItem value="Proposal">Proposal</SelectItem>
                      <SelectItem value="Negotiation">Negotiation</SelectItem>
                      <SelectItem value="Closed Won">Closed Won</SelectItem>
                      <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Product Interest</label>
                  <div className="space-y-2 mt-2">
                    {["TruContext", "Tru-InSight", "Video Intelligence", "Graph Analytics", "Threat Detection"].map((product) => (
                      <div key={product} className="flex items-center">
                        <input
                          type="checkbox"
                          id={product}
                          checked={productInterest.includes(product)}
                          onChange={() => toggleProductInterest(product)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <label htmlFor={product} className="ml-2 text-sm">
                          {product}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Deal Description</label>
                  <Textarea
                    value={dealDescription}
                    onChange={(e) => setDealDescription(e.target.value)}
                    placeholder="Describe the opportunity, customer needs, and solution"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer Contact Details */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Contact Details</CardTitle>
                <CardDescription>Primary contact information for this opportunity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Contact Name</label>
                    <Input
                      value={primaryContactName}
                      onChange={(e) => setPrimaryContactName(e.target.value)}
                      placeholder="Enter contact name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Title/Role</label>
                    <Input
                      value={primaryContactTitle}
                      onChange={(e) => setPrimaryContactTitle(e.target.value)}
                      placeholder="e.g., CTO, Security Director"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={primaryContactEmail}
                      onChange={(e) => setPrimaryContactEmail(e.target.value)}
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={primaryContactPhone}
                      onChange={(e) => setPrimaryContactPhone(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partner & Seller Information */}
          <TabsContent value="partner" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Partner & Seller Information</CardTitle>
                <CardDescription>Your company and sales representative details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Sales Rep Name</label>
                    <Input
                      value={partnerSalesRepName}
                      onChange={(e) => setPartnerSalesRepName(e.target.value)}
                      placeholder="Enter sales representative name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sales Rep Email</label>
                    <Input
                      type="email"
                      value={partnerSalesRepEmail}
                      onChange={(e) => setPartnerSalesRepEmail(e.target.value)}
                      placeholder="salesrep@yourcompany.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Sales Rep Phone</label>
                  <Input
                    value={partnerSalesRepPhone}
                    onChange={(e) => setPartnerSalesRepPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Qualification & Program Fields */}
          <TabsContent value="qualification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Qualification & Program Information</CardTitle>
                <CardDescription>Additional details for deal qualification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Opportunity Source</label>
                  <Select value={opportunitySource} onValueChange={setOpportunitySource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inbound">Inbound</SelectItem>
                      <SelectItem value="Outbound">Outbound</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Qualification Notes</label>
                  <Textarea
                    value={qualificationNotes}
                    onChange={(e) => setQualificationNotes(e.target.value)}
                    placeholder="Add any additional notes about this deal"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Attachments</label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" size="sm" asChild>
                        <span>Browse Files</span>
                      </Button>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium">Attached Files:</h4>
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span className="text-sm">{file.name}</span>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => navigate("/partners/dashboard")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? "Submitting..." : "Submit Deal Registration"}
          </Button>
        </div>
      </div>
    </div>
  );
}
