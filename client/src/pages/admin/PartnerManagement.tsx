import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  Filter,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

interface Partner {
  id: number;
  companyName: string;
  primaryContactName: string;
  primaryContactEmail: string;
  partnerType: string;
  partnerStatus: "Prospect" | "Active" | "Inactive" | "Suspended" | "Terminated";
  tier: "Standard" | "Bronze" | "Silver" | "Gold";
  dealCount: number;
  mdfSpent: number;
  mdfBudget: number;
  commissionEarned: number;
  createdAt: string;
}

// Mock data - replace with API call
const mockPartners: Partner[] = [
  {
    id: 1,
    companyName: "TechVision Solutions",
    primaryContactName: "John Smith",
    primaryContactEmail: "john@techvision.com",
    partnerType: "System Integrator",
    partnerStatus: "Active",
    tier: "Gold",
    dealCount: 12,
    mdfSpent: 8500,
    mdfBudget: 15000,
    commissionEarned: 45000,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    companyName: "Cyber Secure Inc",
    primaryContactName: "Sarah Johnson",
    primaryContactEmail: "sarah@cybersecure.com",
    partnerType: "Reseller",
    partnerStatus: "Active",
    tier: "Silver",
    dealCount: 8,
    mdfSpent: 5200,
    mdfBudget: 10000,
    commissionEarned: 28000,
    createdAt: "2024-02-20",
  },
  {
    id: 3,
    companyName: "Digital Innovations",
    primaryContactName: "Mike Chen",
    primaryContactEmail: "mike@digitalinnovations.com",
    partnerType: "Consulting Partner",
    partnerStatus: "Prospect",
    tier: "Standard",
    dealCount: 2,
    mdfSpent: 1200,
    mdfBudget: 5000,
    commissionEarned: 8000,
    createdAt: "2024-03-10",
  },
];

export default function PartnerManagement() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredPartners = useMemo(() => {
    return mockPartners.filter((partner) => {
      const matchesSearch =
        partner.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.primaryContactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.primaryContactEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || partner.partnerStatus === statusFilter;
      const matchesTier = tierFilter === "all" || partner.tier === tierFilter;

      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [searchTerm, statusFilter, tierFilter]);

  const stats = {
    totalPartners: mockPartners.length,
    activePartners: mockPartners.filter((p) => p.partnerStatus === "Active").length,
    totalMdfSpent: mockPartners.reduce((sum, p) => sum + p.mdfSpent, 0),
    totalCommissions: mockPartners.reduce((sum, p) => sum + p.commissionEarned, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Prospect":
        return "bg-blue-100 text-blue-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Suspended":
        return "bg-yellow-100 text-yellow-800";
      case "Terminated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Gold":
        return "text-yellow-600";
      case "Silver":
        return "text-gray-400";
      case "Bronze":
        return "text-orange-600";
      case "Standard":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Management</h1>
          <p className="text-gray-600 mt-1">Manage all partner accounts and activities</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Partners</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPartners}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Partners</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activePartners}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total MDF Spent</p>
                <p className="text-2xl font-bold text-gray-900">${(stats.totalMdfSpent / 1000).toFixed(1)}K</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Commissions</p>
                <p className="text-2xl font-bold text-gray-900">${(stats.totalCommissions / 1000).toFixed(1)}K</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Company, contact, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Prospect">Prospect</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tier</label>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="all">All Tiers</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Partners ({filteredPartners.length})</CardTitle>
          <CardDescription>
            Showing {filteredPartners.length} of {mockPartners.length} partners
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Company</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tier</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Deals</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Commission</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPartners.map((partner) => (
                  <tr key={partner.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{partner.companyName}</p>
                        <p className="text-sm text-gray-600">{partner.primaryContactEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900">{partner.primaryContactName}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600 text-sm">{partner.partnerType}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(partner.partnerStatus)}`}>
                        {partner.partnerStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${getTierColor(partner.tier)}`}>{partner.tier}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <p className="font-medium text-gray-900">{partner.dealCount}</p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <p className="font-medium text-gray-900">${partner.commissionEarned.toLocaleString()}</p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/partners/${partner.id}`)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded-lg transition">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPartners.length === 0 && (
              <div className="py-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No partners found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
