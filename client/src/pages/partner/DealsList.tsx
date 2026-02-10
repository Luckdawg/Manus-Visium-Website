import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { AlertCircle, Plus, Loader2, TrendingUp, DollarSign, CheckCircle2, Clock } from "lucide-react";

const STAGE_COLORS: Record<string, string> = {
  "Qualified Lead": "bg-blue-100 text-blue-800",
  "Proposal": "bg-purple-100 text-purple-800",
  "Negotiation": "bg-orange-100 text-orange-800",
  "Closed Won": "bg-green-100 text-green-800",
  "Closed Lost": "bg-red-100 text-red-800",
};

const STAGE_ICONS: Record<string, any> = {
  "Qualified Lead": Clock,
  "Proposal": TrendingUp,
  "Negotiation": DollarSign,
  "Closed Won": CheckCircle2,
  "Closed Lost": AlertCircle,
};

export default function DealsList() {
  const { user } = useAuth();
  const [selectedStage, setSelectedStage] = useState<string | undefined>();
  
  const { data, isLoading, error } = trpc.partner.getPartnerDeals.useQuery({
    partnerId: user?.id || 0,
  });
  const deals = data?.deals || [];

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">Please log in to view your deals.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalDealValue = deals?.reduce((sum, deal) => sum + Number(deal.dealAmount), 0) || 0;
  const wonDeals = deals?.filter(d => d.dealStage === "Closed Won").length || 0;
  const winRate = deals && deals.length > 0 ? ((wonDeals / deals.length) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Deals</h1>
            <p className="text-muted-foreground">Track and manage your sales opportunities</p>
          </div>
          <Link href="/partners/register-deal">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Register New Deal
            </Button>
          </Link>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Total Deals</div>
              <div className="text-2xl font-bold">{deals?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Total Value</div>
              <div className="text-2xl font-bold">${(totalDealValue / 1000000).toFixed(1)}M</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Won Deals</div>
              <div className="text-2xl font-bold">{wonDeals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
              <div className="text-2xl font-bold">{winRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            variant={selectedStage === undefined ? "default" : "outline"}
            onClick={() => setSelectedStage(undefined)}
            size="sm"
          >
            All Deals
          </Button>
          {["Qualified Lead", "Proposal", "Negotiation", "Closed Won", "Closed Lost"].map(stage => (
            <Button
              key={stage}
              variant={selectedStage === stage ? "default" : "outline"}
              onClick={() => setSelectedStage(stage)}
              size="sm"
            >
              {stage}
            </Button>
          ))}
        </div>

        {/* Deals List */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Pipeline</CardTitle>
            <CardDescription>Your registered opportunities and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">Error loading deals: {error.message}</p>
              </div>
            ) : deals.length > 0 ? (
              <div className="space-y-3">
                {deals.map((deal: any) => {
                  const StageIcon = STAGE_ICONS[deal.dealStage] || Clock;
                  return (
                    <Link key={deal.id} href={`/partners/deals/${deal.id}`}>
                      <div className="border rounded-lg p-4 hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{deal.dealName}</h3>
                            <p className="text-sm text-muted-foreground">{deal.customerName}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${STAGE_COLORS[deal.dealStage]}`}>
                            <StageIcon className="h-4 w-4" />
                            {deal.dealStage}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Deal Amount</span>
                            <p className="font-semibold">${Number(deal.dealAmount).toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Commission</span>
                            <p className="font-semibold">${Number(deal.commissionAmount || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Industry</span>
                            <p className="font-semibold">{deal.customerIndustry || "—"}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expected Close</span>
                            <p className="font-semibold">
                              {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No deals registered yet</p>
                <Link href="/partners/register-deal">
                  <Button>Register Your First Deal</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base">Deal Management Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• <strong>Track Progress:</strong> Update deal stages as they progress through your sales cycle</p>
            <p>• <strong>Commission Tracking:</strong> Your commission is calculated based on the deal amount and your partner tier</p>
            <p>• <strong>Support:</strong> Contact your account manager for deal support and customer introductions</p>
            <p>Questions? Email <strong>partners@visiumtechnologies.com</strong></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
