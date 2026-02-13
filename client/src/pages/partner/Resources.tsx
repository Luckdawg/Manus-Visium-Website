import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";

export default function Resources() {
  const { data: response, isLoading } = trpc.partner.getAllDeals.useQuery();
  const deals = response?.deals || [];

  if (isLoading) {
    return <div className="p-8">Loading resources...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Partner Resources</h1>
      <p className="text-gray-600 mb-8">Access sales collateral, technical documentation, and marketing assets.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Sales Collateral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Product datasheets, pricing guides, and case studies.</p>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Technical Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">API docs, integration guides, and deployment resources.</p>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Docs
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Deals ({deals.length})</h2>
        {deals.length > 0 ? (
          <div className="space-y-2">
            {deals.map((deal: any) => (
              <Card key={deal.id}>
                <CardContent className="pt-6">
                  <p className="font-medium">{deal.dealName}</p>
                  <p className="text-sm text-gray-600">{deal.customerName}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No deals registered yet.</p>
        )}
      </div>
    </div>
  );
}
