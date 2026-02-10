import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, XCircle, Clock, DollarSign } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Deal {
  id: number;
  dealName: string;
  customerName: string;
  dealValue: number;
  dealCurrency: string;
  dealStage: string;
  dealStatus: string;
  commissionPercentage: number;
  commissionAmount: number | null;
  createdAt: string;
}

export default function AdminDealApproval() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [customCommission, setCustomCommission] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const getAllDealsMutation = trpc.partner.getAllDeals.useQuery();
  const updateDealStatusMutation = trpc.partner.updateDealStatus.useMutation();

  useEffect(() => {
    if (getAllDealsMutation.data) {
      setDeals(getAllDealsMutation.data as any);
    }
  }, [getAllDealsMutation.data]);

  const handleApproveDeal = async (deal: Deal) => {
    const commissionAmount = customCommission || (deal.dealValue * deal.commissionPercentage / 100);
    
    try {
      await updateDealStatusMutation.mutateAsync({
        dealId: deal.id,
        status: "Approved",
        commissionAmount,
      });
      
      getAllDealsMutation.refetch();
      setSelectedDeal(null);
      setCustomCommission(null);
    } catch (error) {
      console.error("Failed to approve deal:", error);
    }
  };

  const handleRejectDeal = async (deal: Deal) => {
    try {
      await updateDealStatusMutation.mutateAsync({
        dealId: deal.id,
        status: "Rejected",
      });
      
      getAllDealsMutation.refetch();
      setSelectedDeal(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Failed to reject deal:", error);
    }
  };

  const pendingDeals = deals.filter((d) => d.dealStatus === "Pending Review");
  const approvedDeals = deals.filter((d) => d.dealStatus === "Approved");
  const totalCommissions = approvedDeals.reduce((sum, d) => sum + (d.commissionAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Deal Approval Workflow</h1>
          <p className="text-gray-600">Review and approve partner deals with automatic commission calculations</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Deals</p>
                  <p className="text-3xl font-bold text-primary">{pendingDeals.length}</p>
                </div>
                <Clock className="w-12 h-12 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved Deals</p>
                  <p className="text-3xl font-bold text-green-600">{approvedDeals.length}</p>
                </div>
                <CheckCircle2 className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Deal Value</p>
                  <p className="text-3xl font-bold text-blue-600">${deals.reduce((sum, d) => sum + (d.dealValue || 0), 0).toLocaleString()}</p>
                </div>
                <DollarSign className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Commissions</p>
                  <p className="text-3xl font-bold text-purple-600">${totalCommissions.toLocaleString()}</p>
                </div>
                <DollarSign className="w-12 h-12 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Deals List */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
                <CardTitle>Pending Deal Approvals ({pendingDeals.length})</CardTitle>
                <CardDescription className="text-white/90">Review and approve partner deals</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {pendingDeals.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-600">No pending deals to review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingDeals.map((deal) => (
                      <div
                        key={deal.id}
                        onClick={() => setSelectedDeal(deal)}
                        className={`p-4 border rounded-lg cursor-pointer transition ${
                          selectedDeal?.id === deal.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{deal.dealName}</h3>
                            <p className="text-sm text-gray-600">{deal.customerName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-primary">${deal.dealValue.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{deal.dealCurrency}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Stage: {deal.dealStage}</span>
                          <span className="text-orange-600 font-medium">Pending Review</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Deal Details & Approval Panel */}
          <div>
            {selectedDeal ? (
              <Card className="border-0 shadow-lg sticky top-8">
                <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
                  <CardTitle className="text-lg">Deal Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Deal Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">{selectedDeal.dealName}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">{selectedDeal.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deal Value:</span>
                        <span className="font-medium">${selectedDeal.dealValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stage:</span>
                        <span className="font-medium">{selectedDeal.dealStage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Commission Rate:</span>
                        <span className="font-medium">{selectedDeal.commissionPercentage}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Commission Calculation */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Commission Calculation</h4>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-gray-600">Default Commission:</span>
                        <span className="font-medium">${(selectedDeal.dealValue * selectedDeal.commissionPercentage / 100).toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-500">({selectedDeal.dealValue.toLocaleString()} × {selectedDeal.commissionPercentage}%)</div>
                    </div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Commission (Optional)
                    </label>
                    <input
                      type="number"
                      value={customCommission || ""}
                      onChange={(e) => setCustomCommission(e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="Leave blank to use default"
                    />
                  </div>

                  {/* Rejection Reason */}
                  {approvalAction === "reject" && (
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        rows={3}
                        placeholder="Explain why this deal is being rejected..."
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="border-t pt-4 space-y-3">
                    {approvalAction === null ? (
                      <>
                        <Button
                          onClick={() => handleApproveDeal(selectedDeal)}
                          disabled={updateDealStatusMutation.isPending}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve Deal
                        </Button>
                        <Button
                          onClick={() => setApprovalAction("reject")}
                          variant="outline"
                          className="w-full border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Deal
                        </Button>
                      </>
                    ) : approvalAction === "reject" ? (
                      <>
                        <Button
                          onClick={() => handleRejectDeal(selectedDeal)}
                          disabled={updateDealStatusMutation.isPending || !rejectionReason}
                          className="w-full bg-red-600 hover:bg-red-700"
                        >
                          Confirm Rejection
                        </Button>
                        <Button
                          onClick={() => {
                            setApprovalAction(null);
                            setRejectionReason("");
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-12 pb-12 text-center">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-600">Select a deal to review and approve</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
