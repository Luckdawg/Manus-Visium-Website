import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, TrendingUp, Users, DollarSign } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function PartnerDetails() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/admin/partners/:id");
  const partnerId = params?.id ? parseInt(params.id, 10) : null;

  // Fetch partner deals
  const { data: dealsResponse, isLoading: dealsLoading } = trpc.partner.getPartnerDeals.useQuery(
    { partnerId: partnerId || 0 },
    { enabled: !!partnerId }
  );

  // Fetch all deals to find partner info
  const { data: allDealsResponse, isLoading: allDealsLoading } = trpc.partner.getAllDeals.useQuery();

  if (!match) return null;

  // Extract partner data from deals
  const partnerDeal = dealsResponse?.deals?.[0];
  const partnerName = partnerDeal?.customerName || "Unknown Partner";

  if (allDealsLoading || dealsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading partner details...</p>
        </div>
      </div>
    );
  }

  if (!dealsResponse?.deals || dealsResponse.deals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">Partner not found</p>
            <Button onClick={() => navigate("/admin/partners")} className="w-full mt-4">
              Back to Partners
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const deals = dealsResponse.deals;
  const totalDealValue = deals.reduce((sum, d: any) => sum + (parseFloat(d.dealValue) || 0), 0);
  const activeDealCount = deals.filter((d) => (d as any).dealStatus === "Active").length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/partners")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Partners
          </Button>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{partnerName}</h1>
                <p className="text-gray-600 mt-1">Partner ID: {partnerId}</p>
              </div>
              <Badge className="text-lg px-3 py-1">Active</Badge>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-600">Total Deals</p>
                <p className="text-lg font-semibold">{deals.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Deals</p>
                <p className="text-lg font-semibold">{activeDealCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Deal Value</p>
                <p className="text-lg font-semibold">${totalDealValue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Deal Value</p>
                <p className="text-lg font-semibold">${(totalDealValue / deals.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="deals" className="bg-white rounded-lg shadow-sm">
          <TabsList className="border-b">
            <TabsTrigger value="deals" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Deals ({deals.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Deals Tab */}
          <TabsContent value="deals" className="p-6">
            <div className="space-y-4">
              {deals.map((deal: any) => (
                <Card key={deal.id} className="hover:shadow-md transition">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{deal.dealName}</CardTitle>
                        <CardDescription>{deal.customerName}</CardDescription>
                      </div>
                      <Badge>{deal.dealStatus}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Deal Value</p>
                        <p className="font-semibold">${deal.dealValue?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Expected Close</p>
                        <p className="font-semibold">
                          {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Industry</p>
                        <p className="font-semibold">{deal.customerIndustry || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Customer Size</p>
                        <p className="font-semibold">{deal.customerSize || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Deal Score</p>
                        <p className="font-semibold">{deal.dealScore || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deal Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["Active", "Won", "Lost", "Pending"].map((status) => {
                      const count = deals.filter((d: any) => d.dealStatus === status).length;
                      const percentage = ((count / deals.length) * 100).toFixed(0);
                      return (
                        <div key={status}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{status}</span>
                            <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deal Value by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["Active", "Won", "Lost", "Pending"].map((status) => {
                      const value = deals
                        .filter((d: any) => d.dealStatus === status)
                        .reduce((sum: number, d: any) => sum + (d.dealValue || 0), 0);
                      const percentage = ((value / totalDealValue) * 100).toFixed(0);
                      return (
                        <div key={status}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{status}</span>
                            <span className="text-sm text-gray-600">${value.toLocaleString()} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Deal Documents</CardTitle>
                <CardDescription>Supporting documentation for partner deals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deals.some((d: any) => d.documents?.length > 0) ? (
                    deals.map((deal: any) =>
                      deal.documents?.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold">{doc.documentName}</p>
                            <p className="text-sm text-gray-600">{deal.dealName}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                        </div>
                      ))
                    )
                  ) : (
                    <p className="text-gray-500">No documents found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
