import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, XCircle, Clock, DollarSign } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface Deal {
  id: number;
  dealName: string;
  customerName: string;
  customerEmail: string;
  dealAmount: number;
  dealStage: string;
  dealStatus?: string;
  companyName?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  createdAt?: string;
}

export default function AdminDealApproval() {
  const { user, loading: authLoading } = useAuth();
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [customCommissionPercentage, setCustomCommissionPercentage] = useState<number>(10);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [approvingDealId, setApprovingDealId] = useState<number | null>(null);

  // Fetch pending deals
  const { data: dealsData, isLoading, refetch } = trpc.admin.getPendingDeals.useQuery();

  // Approve deal mutation
  const approveDealMutation = trpc.admin.approveDeal.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedDeal(null);
      setCustomCommissionPercentage(10);
      setApprovalNotes("");
      setApprovingDealId(null);
    },
    onError: (error) => {
      console.error("Failed to approve deal:", error);
      alert(`Error approving deal: ${error.message}`);
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
  const pendingDeals = deals.filter((d: Deal) => !d.dealStatus || d.dealStatus !== "Approved");
  const approvedDeals = deals.filter((d: Deal) => d.dealStatus === "Approved");
  const totalDealValue = deals.reduce((sum: number, d: Deal) => sum + (d.dealAmount || 0), 0);
  const totalCommissions = approvedDeals.reduce((sum: number, d: Deal) => {
    const commission = (d.dealAmount || 0) * (customCommissionPercentage / 100);
    return sum + commission;
  }, 0);

  const handleApproveDeal = async (deal: Deal) => {
    if (!deal.id) return;
    
    setApprovingDealId(deal.id);
    try {
      await approveDealMutation.mutateAsync({
        dealId: deal.id,
        commissionPercentage: customCommissionPercentage,
        approvalNotes,
      });
    } catch (error) {
      console.error("Error approving deal:", error);
    } finally {
      setApprovingDealId(null);
    }
  };

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
                  <p className="text-3xl font-bold text-blue-600">${totalDealValue.toLocaleString()}</p>
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
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading deals...</p>
                  </div>
                ) : pendingDeals.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-600">No pending deals to review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingDeals.map((deal: Deal) => (
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
                            {deal.companyName && (
                              <p className="text-xs text-gray-500">{deal.companyName}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-primary">${deal.dealAmount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">USD</p>
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
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-xs">{selectedDeal.customerEmail}</span>
                      </div>
                      {selectedDeal.companyName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Company:</span>
                          <span className="font-medium">{selectedDeal.companyName}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deal Value:</span>
                        <span className="font-medium">${selectedDeal.dealAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stage:</span>
                        <span className="font-medium">{selectedDeal.dealStage}</span>
                      </div>
                    </div>
                  </div>

                  {/* Commission Calculation */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Commission Calculation</h4>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-gray-600">Commission Rate:</span>
                        <span className="font-medium">{customCommissionPercentage}%</span>
                      </div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-gray-600">Commission Amount:</span>
                        <span className="font-bold text-primary">
                          ${((selectedDeal.dealAmount * customCommissionPercentage) / 100).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        ({selectedDeal.dealAmount.toLocaleString()} × {customCommissionPercentage}%)
                      </div>
                    </div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Percentage (%)
                    </label>
                    <input
                      type="number"
                      value={customCommissionPercentage}
                      onChange={(e) => setCustomCommissionPercentage(parseFloat(e.target.value) || 10)}
                      min="0"
                      max="100"
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Approval Notes */}
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Approval Notes (Optional)
                    </label>
                    <textarea
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      rows={3}
                      placeholder="Add any notes about this approval..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t pt-4 space-y-3">
                    <Button
                      onClick={() => handleApproveDeal(selectedDeal)}
                      disabled={approvingDealId === selectedDeal.id || approveDealMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {approvingDealId === selectedDeal.id ? "Approving..." : "Approve Deal"}
                    </Button>
                    <Button
                      onClick={() => setSelectedDeal(null)}
                      variant="outline"
                      className="w-full"
                    >
                      Cancel
                    </Button>
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
