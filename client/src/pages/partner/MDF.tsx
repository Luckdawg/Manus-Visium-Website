import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const mdfFormSchema = z.object({
  claimName: z.string().min(1, "Claim name is required"),
  description: z.string().min(1, "Description is required"),
  campaignType: z.enum([
    "Digital Marketing",
    "Event Sponsorship",
    "Content Creation",
    "Sales Enablement",
    "Training",
    "Co-Marketing",
    "Other",
  ]),
  requestedAmount: z.coerce.number().positive("Amount must be positive"),
});

type MdfForm = z.infer<typeof mdfFormSchema>;

const statusIcons: Record<string, React.ReactNode> = {
  Draft: <Clock className="h-4 w-4 text-gray-500" />,
  Submitted: <Clock className="h-4 w-4 text-blue-500" />,
  "Under Review": <Clock className="h-4 w-4 text-yellow-500" />,
  Approved: <CheckCircle className="h-4 w-4 text-green-500" />,
  Rejected: <XCircle className="h-4 w-4 text-red-500" />,
  Paid: <CheckCircle className="h-4 w-4 text-green-600" />,
  Archived: <Clock className="h-4 w-4 text-gray-400" />,
};

export default function PartnerMDF() {
  const { user, loading: authLoading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<MdfForm>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data: mdfInfo, isLoading, refetch } = trpc.partner.getMdfInfo.useQuery(undefined, {
    enabled: !!user && user.role === "partner",
  });

  const submitClaimMutation = trpc.partner.submitMdfClaim.useMutation({
    onSuccess: () => {
      setFormData({});
      setShowForm(false);
      refetch();
    },
    onError: (error: any) => {
      setFormErrors({ submit: error.message });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    try {
      const validated = mdfFormSchema.parse(formData);
      await submitClaimMutation.mutateAsync(validated);
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

  const totalBudget = Number(mdfInfo?.totalBudget) || 0;
  const totalRequested = mdfInfo?.claims?.reduce((sum: number, claim: any) => sum + Number(claim.requestedAmount), 0) || 0;
  const totalApproved = mdfInfo?.claims
    ?.filter((c: any) => c.status === "Approved" || c.status === "Paid")
    .reduce((sum: number, claim: any) => sum + Number(claim.approvedAmount || 0), 0) || 0;
  const remainingBudget = totalBudget - totalApproved;

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Marketing Development Fund (MDF)</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "Submit Claim"}
        </Button>
      </div>

      {/* MDF Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Annual Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved & Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalApproved.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">${remainingBudget.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* MDF Claim Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Submit New MDF Claim</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Claim Name</label>
                <input
                  type="text"
                  value={formData.claimName || ""}
                  onChange={(e) => setFormData({ ...formData, claimName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Q1 Digital Marketing Campaign"
                />
                {formErrors.claimName && <p className="text-sm text-red-500 mt-1">{formErrors.claimName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Campaign Type</label>
                <select
                  value={formData.campaignType || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      campaignType: e.target.value as MdfForm["campaignType"],
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select campaign type...</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Event Sponsorship">Event Sponsorship</option>
                  <option value="Content Creation">Content Creation</option>
                  <option value="Sales Enablement">Sales Enablement</option>
                  <option value="Training">Training</option>
                  <option value="Co-Marketing">Co-Marketing</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.campaignType && <p className="text-sm text-red-500 mt-1">{formErrors.campaignType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Requested Amount ($)</label>
                <input
                  type="number"
                  value={formData.requestedAmount || ""}
                  onChange={(e) => setFormData({ ...formData, requestedAmount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="5000"
                />
                {formErrors.requestedAmount && <p className="text-sm text-red-500 mt-1">{formErrors.requestedAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe the marketing initiative and expected outcomes..."
                  rows={4}
                />
                {formErrors.description && <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>}
              </div>

              {formErrors.submit && <p className="text-sm text-red-500">{formErrors.submit}</p>}

              <div className="flex gap-4">
                <Button type="submit" disabled={submitClaimMutation.isPending}>
                  {submitClaimMutation.isPending ? "Submitting..." : "Submit Claim"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Claims List */}
      <Card>
        <CardHeader>
          <CardTitle>Your MDF Claims</CardTitle>
        </CardHeader>
        <CardContent>
          {mdfInfo?.claims && mdfInfo.claims.length > 0 ? (
            <div className="space-y-4">
              {mdfInfo.claims.map((claim: any) => (
                <div key={claim.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{claim.claimName}</h3>
                      <p className="text-sm text-gray-600">{claim.campaignType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusIcons[claim.status] || <Clock className="h-4 w-4" />}
                      <span className="text-sm font-medium">{claim.status}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{claim.description}</p>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Requested</p>
                      <p className="font-medium">${Number(claim.requestedAmount).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Approved</p>
                      <p className="font-medium">${Number(claim.approvedAmount || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Paid</p>
                      <p className="font-medium">${Number(claim.paidAmount || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  {claim.approvalNotes && (
                    <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-900">
                      <p className="font-medium">Notes:</p>
                      <p>{claim.approvalNotes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No claims submitted yet</p>
              <Button onClick={() => setShowForm(true)}>Submit Your First Claim</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
