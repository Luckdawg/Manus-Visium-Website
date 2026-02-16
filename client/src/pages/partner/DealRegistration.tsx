import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function DealRegistration() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("customer");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer & Account Info
  const [customerCompanyName, setCustomerCompanyName] = useState("");
  const [legalEntity, setLegalEntity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [accountType, setAccountType] = useState("existing");

  // Opportunity/Deal Details
  const [dealName, setDealName] = useState("");
  const [dealDescription, setDealDescription] = useState("");
  const [productFamily, setProductFamily] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [estimatedCloseDate, setEstimatedCloseDate] = useState("");
  const [dealProbability, setDealProbability] = useState("");
  const [salesStage, setSalesStage] = useState("");
  const [dealType, setDealType] = useState("");
  const [contractStartDate, setContractStartDate] = useState("");
  const [contractEndDate, setContractEndDate] = useState("");

  // Customer Contact Details
  const [primaryContactName, setPrimaryContactName] = useState("");
  const [primaryContactTitle, setPrimaryContactTitle] = useState("");
  const [primaryContactEmail, setPrimaryContactEmail] = useState("");
  const [primaryContactPhone, setPrimaryContactPhone] = useState("");

  // Partner & Seller Information
  const [partnerCompanyName, setPartnerCompanyName] = useState("");
  const [partnerSalesRepName, setPartnerSalesRepName] = useState("");
  const [partnerSalesRepEmail, setPartnerSalesRepEmail] = useState("");
  const [partnerSalesRepPhone, setPartnerSalesRepPhone] = useState("");
  const [internalOwner, setInternalOwner] = useState("");

  // Qualification & Program Fields
  const [qualificationNotes, setQualificationNotes] = useState("");
  const [opportunitySource, setOpportunitySource] = useState("");
  const [partnerRole, setPartnerRole] = useState("");
  const [territory, setTerritory] = useState("");

  // Custom Fields
  const [verticalFocus, setVerticalFocus] = useState("");
  const [competitiveVendor, setCompetitiveVendor] = useState("");
  const [mdfLinkage, setMdfLinkage] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const submitDealMutation = trpc.partner.submitDeal.useMutation();

  const handleSubmit = async () => {
    if (!dealName || !customerCompanyName || !dealValue || !estimatedCloseDate) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const dealData = {
        customerCompanyName,
        dealName,
        dealValue: parseFloat(dealValue),
        estimatedCloseDate,
        salesStage,
        dealType,
        primaryContactEmail,
      };
      await submitDealMutation.mutateAsync(dealData);
      alert("Deal registration submitted successfully! Your deal is now pending admin approval.");
      navigate("/partners/dashboard");
    } catch (error) {
      alert("Error submitting deal registration");
      console.error(error);
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
                    <label className="text-sm font-medium">Legal Entity</label>
                    <Input
                      value={legalEntity}
                      onChange={(e) => setLegalEntity(e.target.value)}
                      placeholder="Enter legal entity name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Country/Region</label>
                    <Input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Enter country or region"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">State/Province</label>
                    <Input
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Enter state or province"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">City</label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter street address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Industry</label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Financial Services</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Company Size</label>
                    <Select value={companySize} onValueChange={setCompanySize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-50">1-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1,000 employees</SelectItem>
                        <SelectItem value="1001-5000">1,001-5,000 employees</SelectItem>
                        <SelectItem value="5000+">5,000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Account Type</label>
                  <Select value={accountType} onValueChange={setAccountType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="existing">Existing Account</SelectItem>
                      <SelectItem value="new">Create New Account</SelectItem>
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
                <CardDescription>Information about the sales opportunity</CardDescription>
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
                    <label className="text-sm font-medium">Product Family</label>
                    <Input
                      value={productFamily}
                      onChange={(e) => setProductFamily(e.target.value)}
                      placeholder="e.g., TruContext Platform"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Deal Description</label>
                  <Textarea
                    value={dealDescription}
                    onChange={(e) => setDealDescription(e.target.value)}
                    placeholder="Describe the opportunity and customer needs"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Deal Value *</label>
                    <Input
                      type="number"
                      value={dealValue}
                      onChange={(e) => setDealValue(e.target.value)}
                      placeholder="Enter deal value"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Currency</label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Estimated Close Date *</label>
                    <Input
                      type="date"
                      value={estimatedCloseDate}
                      onChange={(e) => setEstimatedCloseDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deal Probability (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={dealProbability}
                      onChange={(e) => setDealProbability(e.target.value)}
                      placeholder="0-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Sales Stage</label>
                    <Select value={salesStage} onValueChange={setSalesStage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sales stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prospecting">Prospecting</SelectItem>
                        <SelectItem value="qualification">Qualification</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="negotiation">Negotiation</SelectItem>
                        <SelectItem value="closed-won">Closed Won</SelectItem>
                        <SelectItem value="closed-lost">Closed Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deal Type</label>
                    <Select value={dealType} onValueChange={setDealType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select deal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-business">New Business</SelectItem>
                        <SelectItem value="expansion">Expansion</SelectItem>
                        <SelectItem value="renewal">Renewal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Contract Start Date</label>
                    <Input
                      type="date"
                      value={contractStartDate}
                      onChange={(e) => setContractStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Contract End Date</label>
                    <Input
                      type="date"
                      value={contractEndDate}
                      onChange={(e) => setContractEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer Contact Details */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Contact Information</CardTitle>
                <CardDescription>Primary customer contact details</CardDescription>
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
                    <label className="text-sm font-medium">Contact Title</label>
                    <Input
                      value={primaryContactTitle}
                      onChange={(e) => setPrimaryContactTitle(e.target.value)}
                      placeholder="e.g., CIO, Security Director"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Contact Email</label>
                    <Input
                      type="email"
                      value={primaryContactEmail}
                      onChange={(e) => setPrimaryContactEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Contact Phone</label>
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
                <CardDescription>Partner company and sales representative details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Partner Company Name</label>
                  <Input
                    value={partnerCompanyName}
                    onChange={(e) => setPartnerCompanyName(e.target.value)}
                    placeholder="Enter partner company name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Partner Sales Rep Name</label>
                    <Input
                      value={partnerSalesRepName}
                      onChange={(e) => setPartnerSalesRepName(e.target.value)}
                      placeholder="Enter sales representative name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Partner Sales Rep Email</label>
                    <Input
                      type="email"
                      value={partnerSalesRepEmail}
                      onChange={(e) => setPartnerSalesRepEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Partner Sales Rep Phone</label>
                  <Input
                    value={partnerSalesRepPhone}
                    onChange={(e) => setPartnerSalesRepPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Internal Owner (Visium)</label>
                  <Input
                    value={internalOwner}
                    onChange={(e) => setInternalOwner(e.target.value)}
                    placeholder="Auto-assigned channel manager or account owner"
                    disabled
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
                <CardDescription>Qualification details and program classification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Qualification Notes</label>
                  <Textarea
                    value={qualificationNotes}
                    onChange={(e) => setQualificationNotes(e.target.value)}
                    placeholder="Budget, authority, need, timeline notes or qualification summary"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Opportunity Source</label>
                    <Select value={opportunitySource} onValueChange={setOpportunitySource}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="campaign">Campaign</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="mdf">MDF Activity</SelectItem>
                        <SelectItem value="inbound">Inbound Lead</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Partner Role</label>
                    <Select value={partnerRole} onValueChange={setPartnerRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select partner role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prime-reseller">Prime Reseller</SelectItem>
                        <SelectItem value="co-sell">Co-Sell Partner</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="isv">ISV</SelectItem>
                        <SelectItem value="si">System Integrator</SelectItem>
                        <SelectItem value="msp">Managed Service Provider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Territory/Region</label>
                    <Input
                      value={territory}
                      onChange={(e) => setTerritory(e.target.value)}
                      placeholder="Enter territory or region"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Vertical Focus</label>
                    <Input
                      value={verticalFocus}
                      onChange={(e) => setVerticalFocus(e.target.value)}
                      placeholder="e.g., Healthcare, Finance, Government"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Competitive Vendor</label>
                    <Input
                      value={competitiveVendor}
                      onChange={(e) => setCompetitiveVendor(e.target.value)}
                      placeholder="If applicable, enter competitor name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">MDF Linkage</label>
                    <Input
                      value={mdfLinkage}
                      onChange={(e) => setMdfLinkage(e.target.value)}
                      placeholder="Link to MDF claim if applicable"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle>Attachments & Documents</CardTitle>
                <CardDescription>Upload RFPs, quotes, SOWs, or other supporting documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium">Click to upload or drag and drop</span>
                      <span className="text-xs text-muted-foreground">PDF, DOC, DOCX, XLS, XLSX up to 10MB</span>
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                    />
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Uploaded Files:</p>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
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
            className="ml-auto"
          >
            {isSubmitting ? "Submitting..." : "Submit Deal Registration"}
          </Button>
        </div>
      </div>
    </div>
  );
}
