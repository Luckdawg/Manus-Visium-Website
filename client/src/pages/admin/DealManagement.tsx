import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AlertCircle, Loader2, Search, CheckCircle2, XCircle, Clock, DollarSign, TrendingUp } from "lucide-react";

const DEAL_STAGES = ["Qualified Lead", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

const STAGE_COLORS: Record<string, string> = {
  "Qualified Lead": "bg-blue-100 text-blue-800",
  "Proposal": "bg-purple-100 text-purple-800",
  "Negotiation": "bg-orange-100 text-orange-800",
  "Closed Won": "bg-green-100 text-green-800",
  "Closed Lost": "bg-red-100 text-red-800",
};

export default function DealManagement() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [newStage, setNewStage] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");

  const { data, isLoading, error, refetch } = trpc.partner.getPartnerDeals.useQuery({
    partnerId: user?.id || 0,
  });
  const deals = data?.deals || [];

  // Note: updateDealStatus procedure can be added to partner router for admin deal status updates
  // const updateDealStatusMutation = trpc.partner.updateDealStatus?.useMutation({
  //   onSuccess: () => {
  //     setSelectedDeal(null);
  //     setNewStage("");
  //     setApprovalNotes("");
  //     refetch();
  //   },
  // });

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">Admin access required. Please log in with an admin account.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const filteredDeals = deals?.filter(deal =>
    deal.dealName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (deal.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  ) || [];

  const totalValue = deals?.reduce((sum: number, deal: any) => sum + Number(deal.dealAmount), 0) || 0;
  const wonDeals = deals?.filter(d => d.dealStage === "Closed Won").length || 0;
  const pendingDeals = deals?.filter(d => ["Qualified Lead", "Proposal", "Negotiation"].includes(d.dealStage)).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Deal Management</h1>
          <p className="text-muted-foreground">Review, approve, and manage partner deals</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Deals</div>
                  <div className="text-2xl font-bold">{deals.length || 0}</div>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Pipeline Value</div>
                  <div className="text-2xl font-bold">${(totalValue / 1000000).toFixed(1)}M</div>
                </div>
                <DollarSign className="h-8 w-8 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Pending Review</div>
                  <div className="text-2xl font-bold">{pendingDeals}</div>
                </div>
                <Clock className="h-8 w-8 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Won Deals</div>
                  <div className="text-2xl font-bold">{wonDeals}</div>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Deals List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>All Partner Deals</CardTitle>
                <CardDescription>Click on a deal to view details and update status</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <Search className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-2.5" />
                    <Input
                      placeholder="Search by deal name, customer, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Deals List */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">Error loading deals: {error.message}</p>
                  </div>
                ) : filteredDeals.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {filteredDeals.map((deal: any) => (
                      <div
                        key={deal.id}
                        onClick={() => setSelectedDeal(deal)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedDeal?.id === deal.id
                            ? "border-primary bg-primary/5"
                            : "border-input hover:border-primary hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{deal.dealName}</h3>
                            <p className="text-sm text-muted-foreground">{deal.customerName}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${STAGE_COLORS[deal.dealStage]}`}>
                            {deal.dealStage}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>Amount: ${Number(deal.dealAmount).toLocaleString()}</div>
                          <div>Email: {deal.customerEmail || "N/A"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No deals found matching your search</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Deal Details & Status Update */}
          <div>
            {selectedDeal ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Deal Details</CardTitle>
                  <CardDescription>Update status and add notes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Deal Info */}
                  <div className="space-y-3 bg-muted p-4 rounded-lg">
                    <div>
                      <span className="text-xs text-muted-foreground">Deal Name</span>
                      <p className="font-semibold">{selectedDeal.dealName}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Customer</span>
                      <p className="font-semibold">{selectedDeal.customerName}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Email</span>
                      <p className="font-semibold text-sm">{selectedDeal.customerEmail || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Amount</span>
                      <p className="font-semibold">${Number(selectedDeal.dealAmount).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Current Stage</span>
                      <p className={`font-semibold text-sm inline-block px-2 py-1 rounded mt-1 ${STAGE_COLORS[selectedDeal.dealStage]}`}>
                        {selectedDeal.dealStage}
                      </p>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Update Stage</label>
                    <select
                      value={newStage}
                      onChange={(e) => setNewStage(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md text-sm"
                    >
                      <option value="">Select new stage</option>
                      {DEAL_STAGES.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>

                  {/* Approval Notes */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Approval Notes</label>
                    <Textarea
                      placeholder="Add notes about this deal..."
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      rows={3}
                      className="text-sm"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => {
                        if (newStage) {
                          // TODO: Implement updateDealStatus mutation
                          // updateDealStatusMutation.mutate({
                          //   dealId: selectedDeal.id,
                          //   newStage: newStage as any,
                          //   notes: approvalNotes,
                          // });
                          console.log("Update deal status:", selectedDeal.id, newStage, approvalNotes);
                        }
                      }}
                      disabled={!newStage}
                      className="flex-1 gap-2"
                    >
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Update Status
                      </>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedDeal(null)}
                      className="flex-1"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Select a deal to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
