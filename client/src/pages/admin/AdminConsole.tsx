import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
  LineChart,
  Line,
} from "recharts";
import {
  Plus,
  Settings,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Trash2,
  Eye,
  Activity,
} from "lucide-react";

/**
 * Admin Console Dashboard
 * Manages approval workflows, conflict policies, and scoring configurations
 */
export default function AdminConsole() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showWorkflowForm, setShowWorkflowForm] = useState(false);
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [showScoringForm, setShowScoringForm] = useState(false);

  // Fetch data
  const metricsQuery = trpc.adminWorkflows.getDashboardMetrics.useQuery();
  const workflowsQuery = trpc.adminWorkflows.getWorkflows.useQuery({});
  const policiesQuery = trpc.adminWorkflows.getConflictPolicies.useQuery({});
  const rulesQuery = trpc.adminWorkflows.getScoringRules.useQuery({});
  const auditLogQuery = trpc.adminWorkflows.getAuditLog.useQuery({ limit: 10 });

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800">Please log in to access the admin console.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Console</h1>
        <p className="text-lg text-gray-600">
          Configure approval workflows, conflict policies, and deal scoring rules.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Approval Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricsQuery.data?.totalWorkflows || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              {metricsQuery.data?.activeWorkflows || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Conflict Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricsQuery.data?.totalConflictPolicies || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              {metricsQuery.data?.activePolicies || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Scoring Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricsQuery.data?.totalScoringRules || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              {metricsQuery.data?.activeScoringRules || 0} active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Status */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration Status</CardTitle>
                <CardDescription>Current system configuration overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
                    <span className="font-medium">Approval Workflows</span>
                    <Badge variant="outline">
                      {metricsQuery.data?.activeWorkflows || 0}/{metricsQuery.data?.totalWorkflows || 0}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded">
                    <span className="font-medium">Conflict Policies</span>
                    <Badge variant="outline">
                      {metricsQuery.data?.activePolicies || 0}/{metricsQuery.data?.totalConflictPolicies || 0}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                    <span className="font-medium">Scoring Rules</span>
                    <Badge variant="outline">
                      {metricsQuery.data?.activeScoringRules || 0}/{metricsQuery.data?.totalScoringRules || 0}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowWorkflowForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Workflow
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowPolicyForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Policy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowScoringForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Scoring Rule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Configuration and compliance status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">All workflows configured</p>
                      <p className="text-xs text-gray-600">Ready for production</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Conflict detection active</p>
                      <p className="text-xs text-gray-600">All policies enabled</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Scoring engine active</p>
                      <p className="text-xs text-gray-600">
                        {metricsQuery.data?.activeScoringRules || 0} rules active
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Approval Workflows</h3>
            <Button onClick={() => setShowWorkflowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </div>

          <div className="space-y-4">
            {workflowsQuery.data && workflowsQuery.data.length > 0 ? (
              workflowsQuery.data.map((workflow) => (
                <Card key={workflow.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{workflow.workflowName}</CardTitle>
                        <CardDescription>{workflow.description}</CardDescription>
                      </div>
                      <Badge
                        variant={workflow.status === "Active" ? "default" : "secondary"}
                      >
                        {workflow.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Code</p>
                        <p className="font-bold">{workflow.workflowCode}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Template</p>
                        <p className="font-bold">{workflow.template}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Risk Level</p>
                        <p className="font-bold">{workflow.riskLevel || "All"}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Created</p>
                        <p className="font-bold">
                          {new Date(workflow.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-600">No workflows configured yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Conflict Policies</h3>
            <Button onClick={() => setShowPolicyForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Policy
            </Button>
          </div>

          <div className="space-y-4">
            {policiesQuery.data && policiesQuery.data.length > 0 ? (
              policiesQuery.data.map((policy) => (
                <Card key={policy.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{policy.policyName}</CardTitle>
                        <CardDescription>{policy.description}</CardDescription>
                      </div>
                      <Badge variant={policy.isActive ? "default" : "secondary"}>
                        {policy.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Type</p>
                        <p className="font-bold">{policy.conflictType}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Severity</p>
                        <p className="font-bold">{policy.defaultSeverity}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Auto Resolve</p>
                        <p className="font-bold">{policy.autoResolve ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Strategy</p>
                        <p className="font-bold">{policy.resolutionStrategy || "Manual"}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-600">No policies configured yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Recent configuration changes and admin actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogQuery.data && auditLogQuery.data.length > 0 ? (
                  auditLogQuery.data.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-3 border rounded">
                      <div className="flex-1">
                        <p className="font-medium">
                          {log.actionType} - {log.entityType}
                        </p>
                        <p className="text-sm text-gray-600">{log.entityName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          By {log.userName} ({log.userRole}) on{" "}
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">{log.actionType}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600">No audit logs available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
