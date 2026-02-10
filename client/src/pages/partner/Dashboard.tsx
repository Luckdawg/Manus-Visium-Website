import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, FileText, DollarSign, Users } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function PartnerDashboard() {
  const [partnerId, setPartnerId] = useState<number>(1); // Default to partnerId 1 for testing
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get partnerId from localStorage, default to 1 if not found
    const sessionId = localStorage.getItem('partnerSessionId');
    if (sessionId) {
      const id = parseInt(sessionId, 10);
      if (!isNaN(id)) {
        setPartnerId(id);
      }
    }
    setIsLoading(false);
  }, []);

  const { data: summary, isLoading: summaryLoading } = trpc.partner.getDashboardSummary.useQuery(
    { partnerId },
    { enabled: true }
  );

  if (isLoading || summaryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Partner Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your partnership overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.activeDeals || 0}</div>
            <p className="text-xs text-gray-500">Deals in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.totalRevenue || 0}</div>
            <p className="text-xs text-gray-500">From approved deals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MDF Available</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.mdfAvailable || 0}</div>
            <p className="text-xs text-gray-500">Marketing development funds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.commissionRate || 0}%</div>
            <p className="text-xs text-gray-500">Your current rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link href="/partners/deals/new">
          <Button className="w-full" size="lg">
            <FileText className="mr-2 h-4 w-4" />
            Submit New Deal
          </Button>
        </Link>
        <Link href="/partners/resources">
          <Button variant="outline" className="w-full" size="lg">
            <Users className="mr-2 h-4 w-4" />
            View Resources
          </Button>
        </Link>
      </div>

      {/* Recent Deals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
        </CardHeader>
        <CardContent>
          {summary?.recentDeals && summary.recentDeals.length > 0 ? (
            <div className="space-y-4">
              {summary.recentDeals.map((deal: any) => (
                <div key={deal.id} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{deal.dealName}</p>
                    <p className="text-sm text-gray-500">{deal.customerCompany}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${deal.dealAmount}</p>
                    <p className="text-sm text-gray-500">{deal.dealStatus}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent deals</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
