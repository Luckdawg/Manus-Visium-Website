import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, FileText, DollarSign, Users } from "lucide-react";
import { Link } from "wouter";

export default function PartnerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { data: summary, isLoading } = trpc.partner.getDashboardSummary.useQuery(undefined, {
    enabled: !!user && user.role === "partner",
  });

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "partner") {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You do not have permission to access the partner portal.</p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Partner Dashboard</h1>
        <p className="text-gray-600">Welcome back, {summary?.partnerCompany?.companyName}!</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.recentDeals?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Deals in pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.partnerCompany?.commissionRate}%</div>
            <p className="text-xs text-muted-foreground">Standard rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MDF Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.partnerCompany?.mdfBudgetAnnual}</div>
            <p className="text-xs text-muted-foreground">Annual allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partner Tier</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.partnerCompany?.tier || "Standard"}</div>
            <p className="text-xs text-muted-foreground">Current status</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/partners/deals">
            <Button variant="outline" className="w-full">
              Submit Deal
            </Button>
          </Link>
          <Link href="/partners/resources">
            <Button variant="outline" className="w-full">
              View Resources
            </Button>
          </Link>
          <Link href="/partners/mdf">
            <Button variant="outline" className="w-full">
              Submit MDF Claim
            </Button>
          </Link>
          <Link href="/partners/analytics">
            <Button variant="outline" className="w-full">
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Deals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
        </CardHeader>
        <CardContent>
          {summary?.recentDeals && summary.recentDeals.length > 0 ? (
            <div className="space-y-4">
              {summary.recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                  <div>
                    <p className="font-medium">{deal.dealName}</p>
                    <p className="text-sm text-gray-600">{deal.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${deal.dealAmount}</p>
                    <p className="text-sm text-gray-600">{deal.dealStage}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No deals yet</p>
              <Link href="/partners/deals">
                <Button>Submit Your First Deal</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
