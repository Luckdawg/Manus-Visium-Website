import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ExportModal from "@/components/ExportModal";
import type { ExportOptions } from "@/components/ExportModal";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
} from "recharts";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Award,
  Activity,
  Download,
} from "lucide-react";

/**
 * Analytics Dashboard - Executive visibility and metrics
 * Displays KPIs, deal pipeline funnel, partner performance, and financial metrics
 */
export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [selectedMetric, setSelectedMetric] = useState<"revenue" | "deals" | "health">("revenue");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Fetch analytics data
  const { data: kpis, isLoading: kpisLoading } = trpc.analytics.getExecutiveKPIs.useQuery({});
  const { data: pipelineFunnel, isLoading: funnelLoading } =
    trpc.analytics.getDealPipelineFunnel.useQuery({});
  const { data: partnerPerformance, isLoading: performanceLoading } =
    trpc.analytics.getPartnerPerformance.useQuery({ sortBy: selectedMetric });
  const { data: leaderboard, isLoading: leaderboardLoading } =
    trpc.analytics.getPartnerLeaderboard.useQuery({ metric: selectedMetric });
  const { data: healthScores, isLoading: healthLoading } =
    trpc.analytics.getPartnerHealthScores.useQuery({});
  const { data: financialData, isLoading: financialLoading } =
    trpc.analytics.getFinancialAnalytics.useQuery({});
  const { data: dealVelocity, isLoading: velocityLoading } =
    trpc.analytics.getDealVelocity.useQuery({});
  const { data: commissions, isLoading: commissionsLoading } =
    trpc.analytics.getCommissionAnalytics.useQuery({});

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  // Export handler
  const handleExport = async (options: ExportOptions) => {
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(false);

    try {
      let result: any;
      const utils = trpc.useUtils();
      
      switch (options.type) {
        case "kpis":
          result = await utils.analyticsExport.exportKPIs.fetch();
          break;
        case "pipeline":
          result = await utils.analyticsExport.exportDealPipeline.fetch();
          break;
        case "partners":
          result = await utils.analyticsExport.exportPartnerPerformance.fetch({ limit: 100 });
          break;
        case "financial":
          result = await utils.analyticsExport.exportFinancial.fetch({});
          break;
        case "training":
          result = await utils.analyticsExport.exportTraining.fetch({ limit: 50 });
          break;
        case "commissions":
          result = await utils.analyticsExport.exportCommissions.fetch();
          break;
        case "all":
          result = await utils.analyticsExport.exportAll.fetch({});
          break;
        default:
          throw new Error("Invalid export type");
      }

      if (result) {
        const { filename, content } = result;
        const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setExportSuccess(true);
      }
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  // KPI Cards
  const KPICard = ({
    title,
    value,
    icon: Icon,
    trend,
    color,
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className: string }>;
    trend?: number;
    color: string;
  }) => (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs mt-1 ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          {(["7d", "30d", "90d", "1y"] as const).map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? "default" : "outline"}
              onClick={() => setDateRange(range)}
              size="sm"
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : range === "90d" ? "90 Days" : "1 Year"}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={`$${(kpis?.annualRecurringRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          trend={parseFloat(kpis?.revenueGrowthRate?.toString() || "0")}
          color="text-green-600"
        />
        <KPICard
          title="Active Partners"
          value={kpis?.totalActivePartners || 0}
          icon={Users}
          trend={parseFloat(kpis?.partnerGrowthRate?.toString() || "0")}
          color="text-blue-600"
        />
        <KPICard
          title="Pipeline Value"
          value={`$${(kpis?.totalPipelineValue || 0).toLocaleString()}`}
          icon={Target}
          color="text-orange-600"
        />
        <KPICard
          title="Win Rate"
          value={`${parseFloat(kpis?.dealWinRate?.toString() || "0").toFixed(1)}%`}
          icon={TrendingUp}
          color="text-purple-600"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deal Pipeline Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Pipeline Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            {funnelLoading ? (
              <div className="h-80 flex items-center justify-center text-gray-400">
                Loading...
              </div>
            ) : pipelineFunnel && pipelineFunnel.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <FunnelChart>
                  <Tooltip />
                  <Funnel
                    dataKey="count"
                    data={pipelineFunnel}
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.8}
                  >
                    {pipelineFunnel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                No pipeline data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Partner Health Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Partner Health Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <div className="h-80 flex items-center justify-center text-gray-400">
                Loading...
              </div>
            ) : healthScores && healthScores.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={healthScores.slice(0, 10).map((score) => ({
                    name: `Partner ${score.partnerId}`,
                    health: score.healthScore,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="health" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                No health data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Partner Performance & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Partner Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Top Partners by {selectedMetric}</CardTitle>
            <div className="flex gap-2 mt-4">
              {(["revenue", "deals", "health"] as const).map((metric) => (
                <Button
                  key={metric}
                  variant={selectedMetric === metric ? "default" : "outline"}
                  onClick={() => setSelectedMetric(metric)}
                  size="sm"
                >
                  {metric === "revenue" ? "Revenue" : metric === "deals" ? "Deals" : "Health"}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {performanceLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : partnerPerformance && partnerPerformance.length > 0 ? (
              <div className="space-y-3">
                {partnerPerformance.slice(0, 5).map((partner, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium">Partner {partner.partnerCompanyId}</p>
                      <p className="text-sm text-gray-600">
                        {selectedMetric === "revenue"
                          ? `$${partner.totalRevenue}`
                          : selectedMetric === "deals"
                            ? `${partner.totalDealsWon} deals`
                            : `Score: ${partner.healthScore}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{
                            width: `${
                              selectedMetric === "revenue"
                                ? Math.min((parseFloat(partner.totalRevenue.toString()) / 1000000) * 100, 100)
                                : selectedMetric === "deals"
                                  ? Math.min((partner.totalDealsWon / 100) * 100, 100)
                                  : partner.healthScore
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">No performance data available</div>
            )}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {commissionsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : commissions ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="font-medium">Total Commissions</span>
                  <span className="text-lg font-bold text-blue-600">
                    ${parseFloat(commissions.totalCommissions?.toString() || "0").toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span className="font-medium">Commission Rate</span>
                  <span className="text-lg font-bold text-green-600">
                    {parseFloat(commissions.commissionRate?.toString() || "0").toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                  <span className="font-medium">Deals Won</span>
                  <span className="text-lg font-bold text-orange-600">{commissions.dealsWon}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                  <span className="font-medium">Avg Commission/Deal</span>
                  <span className="text-lg font-bold text-purple-600">
                    ${commissions.avgCommissionPerDeal?.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">No financial data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Deal Velocity */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Velocity by Stage</CardTitle>
        </CardHeader>
        <CardContent>
          {velocityLoading ? (
            <div className="h-80 flex items-center justify-center text-gray-400">
              Loading...
            </div>
          ) : dealVelocity && dealVelocity.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dealVelocity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgDaysInStage" fill="#3b82f6" name="Avg Days in Stage" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">
              No velocity data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        isLoading={isExporting}
        error={exportError}
        exportTypes={["kpis", "pipeline", "partners", "financial", "training", "commissions", "all"]}
      />
    </div>
  );
}
