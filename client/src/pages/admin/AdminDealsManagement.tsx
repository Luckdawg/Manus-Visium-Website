import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Trash2, Edit2, Plus, Upload, Download, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface Deal {
  id: number;
  dealName: string;
  customerName: string;
  dealAmount: number;
  dealStage: string;
  dealStatus: string;
  companyName?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  tier?: string;
  createdAt?: string;
}

interface Partner {
  id: number;
  companyName: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone?: string;
  tier: string;
  mdfBudget: number;
  commissionRate?: number;
}

export default function AdminDealsManagement() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"deals" | "partners">("deals");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [dealFilter, setDealFilter] = useState("all");
  const [showCreateDealForm, setShowCreateDealForm] = useState(false);
  const [showEditDealForm, setShowEditDealForm] = useState(false);
  const [showEditPartnerForm, setShowEditPartnerForm] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  // Form states
  const [dealFormData, setDealFormData] = useState({
    partnerCompanyId: 0,
    dealName: "",
    customerName: "",
    dealAmount: 0,
    dealStage: "Prospecting",
    expectedCloseDate: "",
    description: "",
  });

  const [partnerFormData, setPartnerFormData] = useState({
    companyName: "",
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    tier: "Standard",
    mdfBudget: 0,
  });

  // Fetch all deals
  const { data: dealsData, isLoading: dealsLoading, refetch: refetchDeals } = trpc.admin.getAllDeals.useQuery({
    status: dealFilter as any,
    limit: 200,
  });

  // Fetch all partners
  const { data: partnersData, isLoading: partnersLoading, refetch: refetchPartners } = trpc.admin.getAllPartners.useQuery();

  // Fetch deal attachments
  const { data: attachmentsData, refetch: refetchAttachments } = trpc.admin.getDealAttachments.useQuery(
    { dealId: selectedDeal?.id || 0 },
    { enabled: !!selectedDeal }
  );

  // Mutations
  const createDealMutation = trpc.admin.createDeal.useMutation({
    onSuccess: () => {
      refetchDeals();
      setShowCreateDealForm(false);
      setDealFormData({
        partnerCompanyId: 0,
        dealName: "",
        customerName: "",
        dealAmount: 0,
        dealStage: "Prospecting",
        expectedCloseDate: "",
        description: "",
      });
    },
  });

  const updateDealMutation = trpc.admin.updateDeal.useMutation({
    onSuccess: () => {
      refetchDeals();
      setShowEditDealForm(false);
      setSelectedDeal(null);
    },
  });

  const deleteDealMutation = trpc.admin.deleteDeal.useMutation({
    onSuccess: () => {
      refetchDeals();
      setSelectedDeal(null);
    },
  });

  const updatePartnerMutation = trpc.admin.updatePartner.useMutation({
    onSuccess: () => {
      refetchPartners();
      setShowEditPartnerForm(false);
      setSelectedPartner(null);
    },
  });

  const deletePartnerMutation = trpc.admin.deletePartner.useMutation({
    onSuccess: () => {
      refetchPartners();
      setSelectedPartner(null);
    },
  });

  const uploadAttachmentMutation = trpc.admin.uploadDealAttachment.useMutation({
    onSuccess: () => {
      refetchAttachments();
    },
  });

  const deleteAttachmentMutation = trpc.admin.deleteAttachment.useMutation({
    onSuccess: () => {
      refetchAttachments();
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !["admin", "super_admin"].includes(user.role || "")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  const deals = dealsData?.deals || [];
  const partners = partnersData || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Deals & Partners Management</h1>
          <p className="text-gray-600">Manage all partner deals, companies, and attachments</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setActiveTab("deals")}
            className={activeTab === "deals" ? "bg-primary text-white" : "bg-white text-gray-700 border border-gray-300"}
          >
            Deals Management
          </Button>
          <Button
            onClick={() => setActiveTab("partners")}
            className={activeTab === "partners" ? "bg-primary text-white" : "bg-white text-gray-700 border border-gray-300"}
          >
            Partners Management
          </Button>
        </div>

        {/* Deals Tab */}
        {activeTab === "deals" && (
          <div className="space-y-6">
            {/* Deals Controls */}
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Select value={dealFilter} onValueChange={setDealFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Deals</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setShowCreateDealForm(true)} className="bg-primary text-white">
                <Plus className="w-4 h-4 mr-2" /> Create New Deal
              </Button>
            </div>

            {/* Create Deal Form */}
            {showCreateDealForm && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle>Create New Deal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={dealFormData.partnerCompanyId.toString()} onValueChange={(v) => setDealFormData({ ...dealFormData, partnerCompanyId: parseInt(v) })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Partner" />
                    </SelectTrigger>
                    <SelectContent>
                      {partners.map((p: Partner) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Deal Name"
                    value={dealFormData.dealName}
                    onChange={(e) => setDealFormData({ ...dealFormData, dealName: e.target.value })}
                  />
                  <Input
                    placeholder="Customer Name"
                    value={dealFormData.customerName}
                    onChange={(e) => setDealFormData({ ...dealFormData, customerName: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Deal Amount"
                    value={dealFormData.dealAmount}
                    onChange={(e) => setDealFormData({ ...dealFormData, dealAmount: parseFloat(e.target.value) })}
                  />
                  <Input
                    type="date"
                    value={dealFormData.expectedCloseDate}
                    onChange={(e) => setDealFormData({ ...dealFormData, expectedCloseDate: e.target.value })}
                  />
                  <Input
                    placeholder="Description"
                    value={dealFormData.description}
                    onChange={(e) => setDealFormData({ ...dealFormData, description: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => createDealMutation.mutate(dealFormData)} className="bg-green-600 text-white">
                      Create Deal
                    </Button>
                    <Button onClick={() => setShowCreateDealForm(false)} className="bg-gray-400 text-white">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Deals List */}
            <div className="space-y-4">
              {dealsLoading ? (
                <p className="text-gray-600">Loading deals...</p>
              ) : deals.length === 0 ? (
                <p className="text-gray-600">No deals found</p>
              ) : (
                deals.map((deal: Deal) => (
                  <Card key={deal.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedDeal(deal)}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{deal.dealName}</h3>
                          <p className="text-sm text-gray-600">Customer: {deal.customerName}</p>
                          <p className="text-sm text-gray-600">Partner: {deal.companyName}</p>
                          <p className="text-sm font-semibold text-primary mt-2">${deal.dealAmount.toLocaleString()}</p>
                          <div className="flex gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${deal.dealStatus === "Approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                              {deal.dealStatus}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">{deal.dealStage}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDeal(deal);
                              setShowEditDealForm(true);
                            }}
                            className="bg-blue-600 text-white"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDealMutation.mutate({ dealId: deal.id });
                            }}
                            className="bg-red-600 text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDeal(deal);
                              setShowAttachments(true);
                            }}
                            className="bg-purple-600 text-white"
                          >
                            <Upload className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Edit Deal Form */}
            {showEditDealForm && selectedDeal && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle>Edit Deal: {selectedDeal.dealName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Deal Name"
                    defaultValue={selectedDeal.dealName}
                    onChange={(e) => setSelectedDeal({ ...selectedDeal, dealName: e.target.value })}
                  />
                  <Input
                    placeholder="Customer Name"
                    defaultValue={selectedDeal.customerName}
                    onChange={(e) => setSelectedDeal({ ...selectedDeal, customerName: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Deal Amount"
                    defaultValue={selectedDeal.dealAmount}
                    onChange={(e) => setSelectedDeal({ ...selectedDeal, dealAmount: parseFloat(e.target.value) })}
                  />
                  <Select value={selectedDeal.dealStatus} onValueChange={(v) => setSelectedDeal({ ...selectedDeal, dealStatus: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateDealMutation.mutate({ dealId: selectedDeal.id, ...selectedDeal })}
                      className="bg-green-600 text-white"
                    >
                      Save Changes
                    </Button>
                    <Button onClick={() => setShowEditDealForm(false)} className="bg-gray-400 text-white">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Attachments */}
            {showAttachments && selectedDeal && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle>Deal Attachments: {selectedDeal.dealName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Drag and drop files here or click to upload</p>
                  </div>

                  {attachmentsData && attachmentsData.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Uploaded Files:</h4>
                      {attachmentsData.map((att: any) => (
                        <div key={att.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                          <div className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            <span className="text-sm">{att.fileName}</span>
                            <span className="text-xs text-gray-500">({(att.fileSize / 1024).toFixed(2)} KB)</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => deleteAttachmentMutation.mutate({ attachmentId: att.id })}
                            className="bg-red-600 text-white"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button onClick={() => setShowAttachments(false)} className="bg-gray-400 text-white">
                    Close
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Partners Tab */}
        {activeTab === "partners" && (
          <div className="space-y-6">
            {/* Partners List */}
            <div className="space-y-4">
              {partnersLoading ? (
                <p className="text-gray-600">Loading partners...</p>
              ) : partners.length === 0 ? (
                <p className="text-gray-600">No partners found</p>
              ) : (
                partners.map((partner: Partner) => (
                  <Card key={partner.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedPartner(partner)}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{partner.companyName}</h3>
                          <p className="text-sm text-gray-600">Contact: {partner.primaryContactName}</p>
                          <p className="text-sm text-gray-600">Email: {partner.primaryContactEmail}</p>
                          <p className="text-sm text-gray-600">Phone: {partner.primaryContactPhone}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">{partner.tier || "Standard"}</span>
                            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">MDF: ${(partner.mdfBudget || 0).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPartner(partner);
                              setPartnerFormData({
                                companyName: partner.companyName,
                                primaryContactName: partner.primaryContactName,
                                primaryContactEmail: partner.primaryContactEmail,
                                primaryContactPhone: partner.primaryContactPhone || "",
                                tier: partner.tier,
                                mdfBudget: partner.mdfBudget,
                              });
                              setShowEditPartnerForm(true);
                            }}
                            className="bg-blue-600 text-white"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePartnerMutation.mutate({ partnerId: partner.id });
                            }}
                            className="bg-red-600 text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Edit Partner Form */}
            {showEditPartnerForm && selectedPartner && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle>Edit Partner: {selectedPartner.companyName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Company Name"
                    value={partnerFormData.companyName}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, companyName: e.target.value })}
                  />
                  <Input
                    placeholder="Contact Name"
                    value={partnerFormData.primaryContactName}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, primaryContactName: e.target.value })}
                  />
                  <Input
                    placeholder="Contact Email"
                    value={partnerFormData.primaryContactEmail}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, primaryContactEmail: e.target.value })}
                  />
                  <Input
                    placeholder="Contact Phone"
                    value={partnerFormData.primaryContactPhone}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, primaryContactPhone: e.target.value })}
                  />
                  <Select value={partnerFormData.tier} onValueChange={(v) => setPartnerFormData({ ...partnerFormData, tier: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Bronze">Bronze</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="MDF Budget"
                    value={partnerFormData.mdfBudget}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, mdfBudget: parseFloat(e.target.value) })}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updatePartnerMutation.mutate({ partnerId: selectedPartner.id, ...partnerFormData })}
                      className="bg-green-600 text-white"
                    >
                      Save Changes
                    </Button>
                    <Button onClick={() => setShowEditPartnerForm(false)} className="bg-gray-400 text-white">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
