import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const dealFormSchema = z.object({
  dealName: z.string().min(1, "Deal name is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email address"),
  dealAmount: z.coerce.number().positive("Deal amount must be positive"),
  description: z.string().min(1, "Description is required"),
});

type DealForm = z.infer<typeof dealFormSchema>;

export default function PartnerDeals() {
  const { user, loading: authLoading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<DealForm>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data: deals, isLoading, refetch } = trpc.partner.getPartnerDeals.useQuery(
    { limit: 50 },
    { enabled: !!user && user.role === "partner" }
  );

  const submitDealMutation = trpc.partner.submitDeal.useMutation({
    onSuccess: () => {
      setFormData({});
      setShowForm(false);
      refetch();
    },
    onError: (error) => {
      setFormErrors({ submit: error.message });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    try {
      const validated = dealFormSchema.parse(formData);
      await submitDealMutation.mutateAsync(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((issue: any) => {
          if (issue.path[0]) {
            errors[issue.path[0] as string] = issue.message;
          }
        });
        setFormErrors(errors);
      }
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "partner") {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access the partner portal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Partner Deals</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "Submit Deal"}
        </Button>
      </div>

      {/* Deal Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Submit New Deal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Deal Name</label>
                <input
                  type="text"
                  value={formData.dealName || ""}
                  onChange={(e) => setFormData({ ...formData, dealName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Acme Corp - TruContext Platform"
                />
                {formErrors.dealName && <p className="text-sm text-red-500 mt-1">{formErrors.dealName}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={formData.customerName || ""}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Acme Corporation"
                  />
                  {formErrors.customerName && <p className="text-sm text-red-500 mt-1">{formErrors.customerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={formData.customerEmail || ""}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="contact@acme.com"
                  />
                  {formErrors.customerEmail && <p className="text-sm text-red-500 mt-1">{formErrors.customerEmail}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deal Amount ($)</label>
                <input
                  type="number"
                  value={formData.dealAmount || ""}
                  onChange={(e) => setFormData({ ...formData, dealAmount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="50000"
                />
                {formErrors.dealAmount && <p className="text-sm text-red-500 mt-1">{formErrors.dealAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe the deal opportunity..."
                  rows={4}
                />
                {formErrors.description && <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>}
              </div>

              {formErrors.submit && <p className="text-sm text-red-500">{formErrors.submit}</p>}

              <div className="flex gap-4">
                <Button type="submit" disabled={submitDealMutation.isPending}>
                  {submitDealMutation.isPending ? "Submitting..." : "Submit Deal"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Deals List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Deals</CardTitle>
        </CardHeader>
        <CardContent>
          {deals && deals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Deal Name</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Stage</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => (
                    <tr key={deal.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{deal.dealName}</td>
                      <td className="py-3 px-4">{deal.customerName}</td>
                      <td className="py-3 px-4 font-medium">${deal.dealAmount}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {deal.dealStage}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(deal.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No deals submitted yet</p>
              <Button onClick={() => setShowForm(true)}>Submit Your First Deal</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
