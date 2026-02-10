import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, CheckCircle2, Clock, AlertCircle, FileText, Plus, Eye, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface DealMetrics {
  totalDeals: number;
  activeDeals: number;
  wonDeals: number;
  lostDeals: number;
  totalDealValue: number;
  averageDealSize: number;
  conversionRate: number;
  commissionEarned: number;
  commissionPaid: number;
  mdfBudget: number;
  mdfSpent: number;
}

interface DealStatusData {
  stage: string;
  count: number;
  value: number;
}

interface MonthlyMetrics {
  month: string;
  deals: number;
  revenue: number;
  commissions: number;
}

const DEAL_STAGE_COLORS: Record<string, string> = {
  "Prospecting": "#3b82f6",
  "Qualification": "#8b5cf6",
  "Needs Analysis": "#ec4899",
  "Proposal": "#f59e0b",
  "Negotiation": "#10b981",
  "Closed Won": "#06b6d4",
  "Closed Lost": "#ef4444",
};

export default function PartnerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<DealMetrics>({
    totalDeals: 0,
    activeDeals: 0,
    wonDeals: 0,
    lostDeals: 0,
    totalDealValue: 0,
    averageDealSize: 0,
    conversionRate: 0,
    commissionEarned: 0,
    commissionPaid: 0,
    mdfBudget: 0,
    mdfSpent: 0,
  });

  const [dealStatusData, setDealStatusData] = useState<DealStatusData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyMetrics[]>([]);

  useEffect(() => {
    const sessionId = localStorage.getItem("partnerId");
    if (sessionId) {
      setPartnerId(parseInt(sessionId, 10));
    } else {
      navigate("/partners/login");
    }
  }, [navigate]);

  const { data: dealsData, isLoading: dealsLoading } = trpc.partner.getPartnerDeals.useQuery(
    { partnerId: partnerId || 0 },
    { enabled: !!partnerId }
  );

  const { data: profileData, isLoading: profileLoading } = trpc.partner.getDashboardSummary.useQuery(
    { partnerId: partnerId || 0 },
    { enabled: !!partnerId }
  );

  useEffect(() => {
    if (!dealsData?.deals) return;

    const deals = dealsData.deals;
    const totalDeals = deals.length;
    const activeDeals = deals.filter((d: any) => !["Closed Won", "Closed Lost"].includes(d.dealStage)).length;
    const wonDeals = deals.filter((d: any) => d.dealStage === "Closed Won").length;
    const lostDeals = deals.filter((d: any) => d.dealStage === "Closed Lost").length;

    const totalDealValue = deals.reduce((sum: number, d: any) => sum + (parseFloat(d.dealAmount) || 0), 0);
    const averageDealSize = totalDeals > 0 ? totalDealValue / totalDeals : 0;
    const conversionRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;

    const commissionEarned = deals.reduce((sum: number, d: any) => {
      if (d.commissionAmount) return sum + parseFloat(d.commissionAmount);
      if (d.commissionPercentage && d.dealAmount) {
        return sum + (parseFloat(d.dealAmount) * parseFloat(d.commissionPercentage)) / 100;
      }
      return sum;
    }, 0);

    const commissionPaid = deals.reduce((sum: number, d: any) => {
      if (d.commissionPaid && d.commissionAmount) {
        return sum + parseFloat(d.commissionAmount);
      }
      return sum;
    }, 0);

    const stageGroups: Record<string, DealStatusData> = {};
    deals.forEach((d: any) => {
      const stage = d.dealStage || "Unknown";
      if (!stageGroups[stage]) {
        stageGroups[stage] = { stage, count: 0, value: 0 };
      }
      stageGroups[stage].count += 1;
      stageGroups[stage].value += parseFloat(d.dealAmount) || 0;
    });

    setDealStatusData(Object.values(stageGroups));

    const monthlyMap: Record<string, MonthlyMetrics> = {};
    deals.forEach((d: any) => {
      const date = new Date(d.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthKey, deals: 0, revenue: 0, commissions: 0 };
      }

      monthlyMap[monthKey].deals += 1;
      monthlyMap[monthKey].revenue += parseFloat(d.dealAmount) || 0;

      if (d.commissionAmount) {
        monthlyMap[monthKey].commissions += parseFloat(d.commissionAmount);
      } else if (d.commissionPercentage && d.dealAmount) {
        monthlyMap[monthKey].commissions +=
          (parseFloat(d.dealAmount) * parseFloat(d.commissionPercentage)) / 100;
      }
    });

    const sortedMonthly = Object.values(monthlyMap)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);

    setMonthlyData(sortedMonthly);

    setMetrics({
      totalDeals,
      activeDeals,
      wonDeals,
      lostDeals,
      totalDealValue,
      averageDealSize,
      conversionRate,
      commissionEarned,
      commissionPaid,
      mdfBudget: 0,
      mdfSpent: 0,
    });
  }, [dealsData, profileData]);

  if (authLoading || profileLoading || dealsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const mdfRemaining = metrics.mdfBudget - metrics.mdfSpent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Partner Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's your performance overview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Active Deals</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.activeDeals}</p>
                  <p className="text-xs text-gray-500 mt-2">{metrics.totalDeals} total deals</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Deal Value</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ${(metrics.totalDealValue / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Avg: ${(metrics.averageDealSize / 1000).toFixed(0)}K per deal
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Won Deals</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.wonDeals}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {metrics.conversionRate.toFixed(1)}% conversion rate
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Commission Earned</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ${(metrics.commissionEarned / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    ${(metrics.commissionPaid / 1000).toFixed(0)}K paid
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Deal Status Distribution</CardTitle>
                  <CardDescription>Deals by stage</CardDescription>
                </CardHeader>
                <CardContent>
                  {dealStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={dealStatusData} dataKey="count" nameKey="stage" cx="50%" cy="50%" outerRadius={100} label>
                          {dealStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={DEAL_STAGE_COLORS[entry.stage] || "#999"} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No deals yet. Start by submitting your first deal!
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                  <CardDescription>Revenue and deals over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                        <Bar dataKey="deals" fill="#8b5cf6" name="Deals" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No data yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Marketing Development Fund (MDF)</CardTitle>
                <CardDescription>Annual budget allocation and usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Annual Budget</p>
                      <p className="text-2xl font-bold text-blue-600">${(metrics.mdfBudget / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600">Spent</p>
                      <p className="text-2xl font-bold text-orange-600">${(metrics.mdfSpent / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Remaining</p>
                      <p className="text-2xl font-bold text-green-600">${(mdfRemaining / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                      style={{ width: `${metrics.mdfBudget > 0 ? (metrics.mdfSpent / metrics.mdfBudget) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {metrics.mdfBudget > 0
                      ? `${((metrics.mdfSpent / metrics.mdfBudget) * 100).toFixed(1)}% of budget used`
                      : "No budget allocated"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Deals</CardTitle>
                  <CardDescription>All submitted deals and their status</CardDescription>
                </div>
                <Button onClick={() => navigate("/partners/deals/submit")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Submit Deal
                </Button>
              </CardHeader>
              <CardContent>
                {dealsData?.deals && dealsData.deals.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Deal Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Stage</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Commission</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dealsData.deals.map((deal: any) => (
                          <tr key={deal.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{deal.dealName}</td>
                            <td className="py-3 px-4">{deal.customerName}</td>
                            <td className="py-3 px-4 font-semibold">${(parseFloat(deal.dealAmount) / 1000).toFixed(0)}K</td>
                            <td className="py-3 px-4">
                              <span
                                className="px-3 py-1 rounded-full text-sm font-medium"
                                style={{
                                  backgroundColor: DEAL_STAGE_COLORS[deal.dealStage] + "20",
                                  color: DEAL_STAGE_COLORS[deal.dealStage],
                                }}
                              >
                                {deal.dealStage}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {deal.commissionAmount ? `$${(parseFloat(deal.commissionAmount) / 1000).toFixed(0)}K` : "-"}
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/partners/deals/${deal.id}`)}
                                className="gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No deals submitted yet</p>
                    <Button onClick={() => navigate("/partners/deals/submit")}>
                      Submit Your First Deal
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Partner Resources</CardTitle>
                <CardDescription>Training materials, sales collateral, and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: "Sales Playbook", type: "PDF", size: "2.4 MB" },
                    { title: "Product Demo Video", type: "MP4", size: "145 MB" },
                    { title: "Implementation Guide", type: "PDF", size: "1.8 MB" },
                    { title: "Customer Success Stories", type: "PDF", size: "3.2 MB" },
                    { title: "Technical Architecture", type: "PDF", size: "2.1 MB" },
                    { title: "Pricing & Positioning", type: "PPT", size: "4.5 MB" },
                  ].map((resource, idx) => (
                    <Card key={idx} className="border hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{resource.type}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{resource.size}</p>
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
