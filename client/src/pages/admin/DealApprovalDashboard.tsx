import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  AlertCircle,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

const DEAL_STAGE_COLORS: Record<string, string> = {
  "Prospecting": "#3b82f6",
  "Qualification": "#8b5cf6",
  "Needs Analysis": "#ec4899",
  "Proposal": "#f59e0b",
  "Negotiation": "#10b981",
  "Closed Won": "#06b6d4",
  "Closed Lost": "#ef4444",
};

export default function DealApprovalDashboard() {
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);

  // Fetch all deals for admin approval
  const { data: allDeals, isLoading: dealsLoading, refetch: refetchDeals } = trpc.partner.getAllDeals.useQuery();

  // Fetch deal details
  const { data: dealDetails } = trpc.partner.getDealDocuments.useQuery(
    { dealId: selectedDealId || 0 },
    { enabled: !!selectedDealId }
  );

  // Approve deal mutation
  const approveMutation = trpc.partner.approveDeal.useMutation({
    onSuccess: () => {
      refetchDeals();
      setSelectedDealId(null);
    },
  });

  // Reject deal mutation
  const rejectMutation = trpc.partner.rejectDeal.useMutation({
    onSuccess: () => {
      refetchDeals();
      setSelectedDealId(null);
    },
  });

  const deals = (allDeals?.deals || []) as any[];
  const pendingDeals = deals.filter((d: any) => d.dealStage === "Prospecting" || d.dealStage === "Qualification");
  const approvedDeals = deals.filter((d: any) => d.dealStage === "Closed Won");
  const rejectedDeals = deals.filter((d: any) => d.dealStage === "Closed Lost");

  const totalValue = deals.reduce((sum: number, d: any) => sum + (parseFloat(d.dealAmount as string) || 0), 0);
  const approvedValue = approvedDeals.reduce((sum: number, d: any) => sum + (parseFloat(d.dealAmount as string) || 0), 0);
  const pendingValue = pendingDeals.reduce((sum: number, d: any) => sum + (parseFloat(d.dealAmount as string) || 0), 0);

  // Partner performance data
  const partnerPerformance = [
    { name: "Partner A", deals: 12, revenue: 450000, commission: 22500 },
    { name: "Partner B", deals: 8, revenue: 320000, commission: 16000 },
    { name: "Partner C", deals: 15, revenue: 580000, commission: 29000 },
    { name: "Partner D", deals: 6, revenue: 240000, commission: 12000 },
  ];

  const monthlyTrends = [
    { month: "Jan", deals: 8, revenue: 320000 },
    { month: "Feb", deals: 12, revenue: 450000 },
    { month: "Mar", deals: 15, revenue: 580000 },
    { month: "Apr", deals: 10, revenue: 400000 },
    { month: "May", deals: 18, revenue: 720000 },
    { month: "Jun", deals: 14, revenue: 560000 },
  ];

  const dealStageDistribution = [
    { name: "Prospecting", value: pendingDeals.filter((d: any) => d.dealStage === "Prospecting").length },
    { name: "Qualification", value: pendingDeals.filter((d: any) => d.dealStage === "Qualification").length },
    { name: "Closed Won", value: approvedDeals.length },
    { name: "Closed Lost", value: rejectedDeals.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Deal Approval Dashboard</h1>
          <p className="text-gray-600">Manage partner deals, approvals, and performance metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Deals</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{deals.length}</p>
                  <p className="text-xs text-gray-500 mt-2">{pendingDeals.length} pending</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Pipeline Value</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ${(totalValue / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    ${(pendingValue / 1000).toFixed(0)}K pending
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Approved Deals</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{approvedDeals.length}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    ${(approvedValue / 1000).toFixed(0)}K value
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Active Partners</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {new Set(deals.map((d: any) => d.partnerCompanyId)).size}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Submitting deals</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="pending">
              Pending ({pendingDeals.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedDeals.length})
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
          </TabsList>

          {/* Pending Deals Tab */}
          <TabsContent value="pending" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Pending Deal Approvals</CardTitle>
                <CardDescription>Deals awaiting review and approval</CardDescription>
              </CardHeader>
              <CardContent>
                {dealsLoading ? (
                  <div className="text-center py-8">Loading deals...</div>
                ) : pendingDeals.length > 0 ? (
                  <div className="space-y-4">
                    {pendingDeals.map((deal: any) => (
                      <div
                        key={deal.id}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedDealId(deal.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{deal.dealName}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {deal.customerName} • {deal.customerEmail}
                            </p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {deal.dealStage}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-600">Deal Amount</p>
                            <p className="font-semibold text-gray-900">
                              ${(parseFloat(deal.dealAmount) / 1000).toFixed(0)}K
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Commission</p>
                            <p className="font-semibold text-gray-900">
                              {deal.commissionPercentage}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Expected Close</p>
                            <p className="font-semibold text-gray-900">
                              {deal.expectedCloseDate
                                ? new Date(deal.expectedCloseDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        {selectedDealId === deal.id && (
                          <div className="flex gap-2 pt-4 border-t">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                approveMutation.mutate({ dealId: deal.id });
                              }}
                              className="gap-2 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                rejectMutation.mutate({ dealId: deal.id });
                              }}
                              className="gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No pending deals</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Deals Tab */}
          <TabsContent value="approved" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Approved Deals</CardTitle>
                <CardDescription>Successfully closed and approved deals</CardDescription>
              </CardHeader>
              <CardContent>
                {approvedDeals.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Deal Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Commission</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Closed Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvedDeals.map((deal: any) => (
                          <tr key={deal.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{deal.dealName}</td>
                            <td className="py-3 px-4">{deal.customerName}</td>
                            <td className="py-3 px-4 font-semibold">
                              ${(parseFloat(deal.dealAmount) / 1000).toFixed(0)}K
                            </td>
                            <td className="py-3 px-4">
                              {deal.commissionAmount
                                ? `$${(parseFloat(deal.commissionAmount) / 1000).toFixed(0)}K`
                                : "-"}
                            </td>
                            <td className="py-3 px-4">
                              {deal.updatedAt
                                ? new Date(deal.updatedAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No approved deals yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>Deal volume and revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue" />
                      <Line type="monotone" dataKey="deals" stroke="#8b5cf6" name="Deals" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Deal Stage Distribution</CardTitle>
                  <CardDescription>Pipeline breakdown by stage</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={dealStageDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {dealStageDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={DEAL_STAGE_COLORS[entry.name] || "#999"} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Partner Performance</CardTitle>
                <CardDescription>Top performing partners by revenue and deal volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={partnerPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    <Bar dataKey="commission" fill="#8b5cf6" name="Commission Paid" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
