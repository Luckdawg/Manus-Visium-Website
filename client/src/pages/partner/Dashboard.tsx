import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, FileText, DollarSign, Users } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function PartnerDashboard() {
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get partnerId from localStorage
    const sessionId = localStorage.getItem('partnerSessionId');
    if (sessionId) {
      setPartnerId(parseInt(sessionId, 10));
    }
    setIsLoading(false);
  }, []);

  const { data: summary, isLoading: summaryLoading } = trpc.partner.getDashboardSummary.useQuery(
    { partnerId: partnerId || 0 },
    { enabled: !!partnerId }
  );

  if (isLoading || summaryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!partnerId) {
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
        <p className="text-gray-600">Welcome back, {summary?.company?.companyName}!</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.activeDealCount || 0}</div>
            <p className="text-xs text-muted-foreground">Deals in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.totalRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MDF Available</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.mdfAvailable?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Marketing Development Funds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.commissionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">Current rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link href="/partner/deals/new">
          <Button className="w-full" size="lg">
            Submit New Deal
          </Button>
        </Link>
        <Link href="/partner/resources">
          <Button variant="outline" className="w-full" size="lg">
            View Resources
          </Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
        </CardHeader>
        <CardContent>
          {summary?.recentDeals && summary.recentDeals.length > 0 ? (
            <div className="space-y-4">
              {summary.recentDeals.map((deal: any) => (
                <div key={deal.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{deal.dealName}</p>
                    <p className="text-sm text-gray-600">{deal.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${deal.dealValue?.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{deal.submittedDate}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No recent deals</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
