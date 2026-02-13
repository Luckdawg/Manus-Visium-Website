import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, CheckCircle2, Clock, AlertCircle, FileText, Plus, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function PartnerDashboard() {
  const { user, logout, loading } = useAuth();
  const [, navigate] = useLocation();
  const [partnerId, setPartnerId] = useState<number | null>(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("partnerId");
    if (sessionId) {
      setPartnerId(parseInt(sessionId, 10));
    }
  }, []);

  // Only redirect if we're sure user is not authenticated (after loading is complete)
  useEffect(() => {
    if (!loading && user === null && partnerId === null) {
      navigate("/partners/login");
    }
  }, [user, partnerId, navigate, loading]);

  const { data: dealsData, isLoading: dealsLoading } = trpc.partner.getPartnerDeals.useQuery(
    { partnerId: partnerId || 0 },
    { enabled: !!partnerId }
  );

  const deals = dealsData?.deals || [];

  const handleLogout = async () => {
    localStorage.removeItem("partnerId");
    await logout();
    navigate("/partners/login");
  };

  if (dealsLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalDeals = deals.length;
  const activeDeals = deals.filter((d: any) => !["Closed Won", "Closed Lost"].includes(d.dealStage)).length;
  const wonDeals = deals.filter((d: any) => d.dealStage === "Closed Won").length;
  const totalDealValue = deals.reduce((sum: number, d: any) => sum + (parseFloat(d.dealAmount) || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Partner Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Manage your deals and partnerships</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total Deals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalDeals}</p>
              <p className="text-xs text-muted-foreground mt-1">{activeDeals} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Pipeline Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${(totalDealValue / 1000).toFixed(1)}K</p>
              <p className="text-xs text-muted-foreground mt-1">Across all deals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Closed Won
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{wonDeals}</p>
              <p className="text-xs text-muted-foreground mt-1">Successful deals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {totalDeals > 0 ? ((wonDeals / totalDeals) * 100).toFixed(0) : 0}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Conversion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Deals Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Deals</CardTitle>
                <CardDescription>Manage and track your sales pipeline</CardDescription>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Register New Deal
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {deals.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No deals registered yet</p>
                <Button className="mt-4">Register Your First Deal</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {deals.map((deal: any) => (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{deal.dealName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {deal.customerName} • {deal.dealStage}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${parseFloat(deal.dealAmount).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{deal.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" className="w-full">
                View Training Courses
              </Button>
              <Button variant="outline" className="w-full">
                Download Resources
              </Button>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
