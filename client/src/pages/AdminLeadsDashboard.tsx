import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Search,
  Users,
  FileText,
  Mail,
  TrendingUp,
  Calendar,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { format } from "date-fns";

type SortField = "createdAt" | "name" | "email" | "company" | "leadScore";
type SortOrder = "asc" | "desc";

export default function AdminLeadsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [activeTab, setActiveTab] = useState<"whitepaper" | "newsletter" | "campaigns">("whitepaper");

  // Fetch data
  const { data: whitepaperLeads, isLoading: loadingWhitepaper } = trpc.leads.getAll.useQuery();
  const { data: newsletterSubs, isLoading: loadingNewsletter } = trpc.newsletter.getAll.useQuery();
  const { data: campaigns, isLoading: loadingCampaigns } = trpc.campaigns.getAll.useQuery();

  // Calculate statistics
  const stats = useMemo(() => {
    const totalLeads = (whitepaperLeads?.length || 0) + (newsletterSubs?.length || 0);
    const whitepaperCount = whitepaperLeads?.length || 0;
    const newsletterCount = newsletterSubs?.length || 0;
    const activeCampaigns = campaigns?.filter(c => c.status === "pending").length || 0;

    return {
      totalLeads,
      whitepaperCount,
      newsletterCount,
      activeCampaigns,
    };
  }, [whitepaperLeads, newsletterSubs, campaigns]);

  // Filter and sort whitepaper leads
  const filteredWhitepaperLeads = useMemo(() => {
    if (!whitepaperLeads) return [];

    let filtered = whitepaperLeads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

    // Sort
    filtered.sort((a: any, b: any) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "createdAt") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [whitepaperLeads, searchQuery, sortField, sortOrder]);

  // Filter and sort newsletter subscribers
  const filteredNewsletterSubs = useMemo(() => {
    if (!newsletterSubs) return [];

    let filtered = newsletterSubs.filter((sub: any) => {
      const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    filtered.sort((a: any, b: any) => {
      const aVal = new Date(a.subscribedAt).getTime();
      const bVal = new Date(b.subscribedAt).getTime();
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [newsletterSubs, searchQuery, sortOrder]);

  // Calculate lead score (simple algorithm based on engagement)
  const calculateLeadScore = (lead: any): number => {
    let score = 50; // Base score

    // Company name provided
    if (lead.company && lead.company.length > 2) {
      score += 20;
    }

    // Recent lead (within 7 days)
    const daysSinceCreated = Math.floor(
      (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceCreated <= 7) {
      score += 30;
    } else if (daysSinceCreated <= 30) {
      score += 15;
    }

    return Math.min(score, 100);
  };

  // Export to CSV
  const exportToCSV = () => {
    let data: any[] = [];
    let headers: string[] = [];
    let filename = "";

    if (activeTab === "whitepaper") {
      headers = ["Name", "Email", "Company", "Lead Score", "Date", "ID"];
      data = filteredWhitepaperLeads.map((lead: any) => [
        lead.name,
        lead.email,
        lead.company,
        calculateLeadScore(lead),
        format(new Date(lead.createdAt), "yyyy-MM-dd HH:mm:ss"),
        lead.id,
      ]);
      filename = "whitepaper-leads.csv";
    } else if (activeTab === "newsletter") {
      headers = ["Email", "Date", "ID"];
      data = filteredNewsletterSubs.map((sub: any) => [
        sub.email,
        format(new Date(sub.subscribedAt), "yyyy-MM-dd HH:mm:ss"),
        sub.id,
      ]);
      filename = "newsletter-subscribers.csv";
    } else if (activeTab === "campaigns") {
      headers = ["Lead Email", "Campaign Type", "Status", "Scheduled Date", "Sent Date"];
      data = (campaigns || []).map((campaign: any) => [
        campaign.leadEmail,
        campaign.campaignType,
        campaign.status,
        format(new Date(campaign.scheduledDate), "yyyy-MM-dd HH:mm:ss"),
        campaign.sentAt ? format(new Date(campaign.sentAt), "yyyy-MM-dd HH:mm:ss") : "Not sent",
      ]);
      filename = "email-campaigns.csv";
    }

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...data.map((row) => row.map((cell: any) => `"${cell}"`).join(",")),
    ].join("\n");

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">Leads Dashboard</h1>
          <p className="text-blue-100">
            Manage and track all whitepaper downloads, newsletter subscribers, and email campaigns
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
              <p className="text-xs text-muted-foreground">All lead sources combined</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Whitepaper Downloads</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.whitepaperCount}</div>
              <p className="text-xs text-muted-foreground">Architecture whitepaper leads</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newsletterCount}</div>
              <p className="text-xs text-muted-foreground">Investor relations subscribers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
              <p className="text-xs text-muted-foreground">Pending email drip campaigns</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "whitepaper" ? "default" : "outline"}
            onClick={() => setActiveTab("whitepaper")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Whitepaper Leads
          </Button>
          <Button
            variant={activeTab === "newsletter" ? "default" : "outline"}
            onClick={() => setActiveTab("newsletter")}
          >
            <Mail className="h-4 w-4 mr-2" />
            Newsletter Subscribers
          </Button>
          <Button
            variant={activeTab === "campaigns" ? "default" : "outline"}
            onClick={() => setActiveTab("campaigns")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Email Campaigns
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={exportToCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardContent className="pt-6">
            {activeTab === "whitepaper" && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSort("name")}
                      >
                        Name <ArrowUpDown className="inline h-4 w-4 ml-1" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSort("email")}
                      >
                        Email <ArrowUpDown className="inline h-4 w-4 ml-1" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSort("company")}
                      >
                        Company <ArrowUpDown className="inline h-4 w-4 ml-1" />
                      </TableHead>
                      <TableHead>Lead Score</TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSort("createdAt")}
                      >
                        Date <ArrowUpDown className="inline h-4 w-4 ml-1" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingWhitepaper ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Loading leads...
                        </TableCell>
                      </TableRow>
                    ) : filteredWhitepaperLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No whitepaper leads found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWhitepaperLeads.map((lead: any) => {
                        const score = calculateLeadScore(lead);
                        return (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.name}</TableCell>
                            <TableCell>{lead.email}</TableCell>
                            <TableCell>{lead.company}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  score >= 80
                                    ? "default"
                                    : score >= 60
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {score}/100
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(lead.createdAt), "MMM dd, yyyy HH:mm")}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {activeTab === "newsletter" && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscription Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingNewsletter ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8">
                          Loading subscribers...
                        </TableCell>
                      </TableRow>
                    ) : filteredNewsletterSubs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                          No newsletter subscribers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredNewsletterSubs.map((sub: any) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{sub.email}</TableCell>
                          <TableCell>
                            {format(new Date(sub.subscribedAt), "MMM dd, yyyy HH:mm")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">Active</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {activeTab === "campaigns" && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead Email</TableHead>
                      <TableHead>Campaign Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Sent Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingCampaigns ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Loading campaigns...
                        </TableCell>
                      </TableRow>
                    ) : !campaigns || campaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No email campaigns found
                        </TableCell>
                      </TableRow>
                    ) : (
                      campaigns.map((campaign: any) => (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.leadEmail}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{campaign.campaignType}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                campaign.status === "sent"
                                  ? "default"
                                  : campaign.status === "pending"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(campaign.scheduledDate), "MMM dd, yyyy HH:mm")}
                          </TableCell>
                          <TableCell>
                            {campaign.sentAt
                              ? format(new Date(campaign.sentAt), "MMM dd, yyyy HH:mm")
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
