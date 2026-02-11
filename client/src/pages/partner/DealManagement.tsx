import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
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
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Filter,
  Plus,
  Eye,
} from "lucide-react";

/**
 * Deal Management Dashboard
 * Displays pipeline, approvals, conflicts, and deal metrics
 */
export default function DealManagement() {
  const { user, isAuthenticated } = useAuth();
  const [selectedStage, setSelectedStage] = useState<string>("Submitted");

  // Fetch deal data
  const pipelineQuery = trpc.dealManagement.getPipelineOverview.useQuery();
  const dealsQuery = trpc.dealManagement.getDealsByStage.useQuery({
    stage: selectedStage,
  });

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800">Please log in to access deal management.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stages = [
    "Submitted",
    "Qualified",
    "In Review",
    "Approved",
    "Rejected",
    "Won",
    "Lost",
  ];

  // Prepare pipeline data for chart
  const pipelineData = stages.map((stage) => ({
    name: stage,
    deals: pipelineQuery.data?.[stage]?.count || 0,
    value: pipelineQuery.data?.[stage]?.totalValue || 0,
  }));

  // Prepare stage distribution data
  const stageDistribution = stages.map((stage, index) => ({
    name: stage,
    value: pipelineQuery.data?.[stage]?.count || 0,
  }));

  const COLORS = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#ef4444",
    "#10b981",
    "#6b7280",
  ];

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Deal Management</h1>
        <p className="text-lg text-gray-600">
          Track deals through multi-stage approvals, manage conflicts, and monitor pipeline metrics.
        </p>
      </div>

      {/* Pipeline Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Object.values(pipelineQuery.data || {}).reduce(
                (sum, stage: any) => sum + (stage?.count || 0),
                0
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Across all stages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              $
              {(
                Object.values(pipelineQuery.data || {}).reduce(
                  (sum, stage: any) => sum + (stage?.totalValue || 0),
                  0
                ) / 1000000
              ).toFixed(1)}
              M
            </div>
            <p className="text-xs text-gray-500 mt-1">Total deal value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {pipelineQuery.data?.["In Review"]?.count || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {pipelineQuery.data?.["Approved"]?.count || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Ready to execute</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
        </TabsList>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pipeline Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Pipeline by Stage</CardTitle>
                <CardDescription>Deal count and value at each stage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pipelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="deals" fill="#3b82f6" name="Deal Count" />
                    <Bar yAxisId="right" dataKey="value" fill="#8b5cf6" name="Value ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Stage Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Deal Distribution</CardTitle>
                <CardDescription>Percentage of deals by stage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stageDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Deals Tab */}
        <TabsContent value="deals" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="flex gap-2 flex-wrap">
              {stages.map((stage) => (
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
          </div>

          <div className="space-y-4">
            {dealsQuery.data && dealsQuery.data.length > 0 ? (
              dealsQuery.data.map((deal) => (
                <Card key={deal.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{deal.dealName}</CardTitle>
                        <CardDescription>{deal.customerName}</CardDescription>
                      </div>
                      <Badge>{deal.currentStage}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Deal Value</p>
                        <p className="font-bold">
                          ${Number(deal.dealValue).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Deal Score</p>
                        <p className="font-bold">{deal.dealScore}/100</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Expected Close</p>
                        <p className="font-bold">
                          {deal.expectedCloseDate
                            ? new Date(deal.expectedCloseDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-bold">{deal.dealStatus}</p>
                      </div>
                    </div>

                    {deal.hasConflict && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-700">
                          Conflict detected: {deal.conflictType}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {deal.currentStage === "In Review" && (
                        <Button size="sm">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-600">No deals in this stage</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Stage Approval Workflow</CardTitle>
              <CardDescription>
                Deals progress through Manager Review → Compliance Check → Executive Approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <span className="font-medium">Manager Review</span>
                  </div>
                  <div className="flex-1 h-1 bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <span className="font-medium">Compliance Check</span>
                  </div>
                  <div className="flex-1 h-1 bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <span className="font-medium text-gray-600">Executive (if needed)</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-900">
                    <strong>Approval Process:</strong> All deals require manager review and
                    compliance check. Deals exceeding $500K or high-risk deals require executive
                    approval.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conflicts Tab */}
        <TabsContent value="conflicts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conflict Management</CardTitle>
              <CardDescription>
                Identify and resolve channel, territory, and customer conflicts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded">
                    <h4 className="font-medium mb-2">Channel Conflict</h4>
                    <p className="text-sm text-gray-600">
                      Multiple partners competing for same customer or territory
                    </p>
                  </div>
                  <div className="p-4 border rounded">
                    <h4 className="font-medium mb-2">Territory Conflict</h4>
                    <p className="text-sm text-gray-600">
                      Overlapping geographic or market segment assignments
                    </p>
                  </div>
                  <div className="p-4 border rounded">
                    <h4 className="font-medium mb-2">Customer Overlap</h4>
                    <p className="text-sm text-gray-600">
                      Same customer engaged with multiple partners
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded">
                  <p className="text-sm text-amber-900">
                    <strong>Conflict Detection:</strong> System automatically flags potential
                    conflicts based on customer, territory, and partner data. Unresolved conflicts
                    may delay deal approval.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
