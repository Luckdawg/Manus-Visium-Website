import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, XCircle, Loader2, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface ApplicationReviewState {
  companyId: number;
  tier: "Gold" | "Silver" | "Bronze" | "Standard";
  commissionRate: number;
  mdfBudgetAnnual: number;
  certifications: string[];
  accountManagerId?: number;
}

export default function PartnerApplications() {
  const [selectedApp, setSelectedApp] = useState<number | null>(null);
  const [reviewState, setReviewState] = useState<ApplicationReviewState | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { data: applications, isLoading, refetch } = trpc.partnerOnboarding.listPendingApplications.useQuery();
  const approveMutation = trpc.partnerOnboarding.approveApplication.useMutation();
  const rejectMutation = trpc.partnerOnboarding.rejectApplication.useMutation();

  const handleApprove = async () => {
    if (!reviewState) return;

    setLoading(true);
    try {
      await approveMutation.mutateAsync({
        companyId: reviewState.companyId,
        tier: reviewState.tier,
        commissionRate: reviewState.commissionRate,
        mdfBudgetAnnual: reviewState.mdfBudgetAnnual,
        certifications: reviewState.certifications.length > 0 ? reviewState.certifications : undefined,
        accountManagerId: reviewState.accountManagerId,
      });

      setMessage("Partner approved successfully!");
      setSelectedApp(null);
      setReviewState(null);
      setTimeout(() => {
        refetch();
        setMessage("");
      }, 2000);
    } catch (error) {
      setMessage("Failed to approve application: " + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp || !rejectionReason.trim()) {
      setMessage("Rejection reason is required");
      return;
    }

    setLoading(true);
    try {
      await rejectMutation.mutateAsync({
        companyId: selectedApp,
        rejectionReason,
      });

      setMessage("Partner application rejected");
      setSelectedApp(null);
      setReviewState(null);
      setRejectionReason("");
      setShowRejectForm(false);
      setTimeout(() => {
        refetch();
        setMessage("");
      }, 2000);
    } catch (error) {
      setMessage("Failed to reject application: " + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedApplication = applications?.find((app) => app.id === selectedApp);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Partner Applications</h1>
          <p className="text-slate-600 mt-2">Review and approve new partner applications</p>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-lg p-4 flex items-start gap-3 ${
              message.includes("Failed")
                ? "bg-red-50 border border-red-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            {message.includes("Failed") ? (
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            )}
            <p
              className={`text-sm ${
                message.includes("Failed")
                  ? "text-red-900"
                  : "text-green-900"
              }`}
            >
              {message}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications</CardTitle>
                <CardDescription>{applications?.length || 0} applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {applications && applications.length > 0 ? (
                  applications.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        setSelectedApp(app.id);
                        setReviewState({
                          companyId: app.id,
                          tier: "Standard",
                          commissionRate: 10,
                          mdfBudgetAnnual: 0,
                          certifications: [],
                        });
                        setShowRejectForm(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        selectedApp === app.id
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <p className="font-semibold text-slate-900">{app.companyName}</p>
                      <p className="text-xs text-slate-600 mt-1">{app.partnerType}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{app.primaryContactEmail}</p>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-600 text-center py-8">No pending applications</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Application Details & Review Form */}
          <div className="lg:col-span-2">
            {selectedApplication && reviewState ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedApplication.companyName}</CardTitle>
                  <CardDescription>Review and approve this application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900">Company Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Company Name</p>
                        <p className="font-medium text-slate-900">{selectedApplication.companyName}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Partner Type</p>
                        <p className="font-medium text-slate-900">{selectedApplication.partnerType}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Website</p>
                        <p className="font-medium text-slate-900">
                          {selectedApplication.website || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Country</p>
                        <p className="font-medium text-slate-900">{selectedApplication.country}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4 border-t border-slate-200 pt-4">
                    <h3 className="font-semibold text-slate-900">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Contact Name</p>
                        <p className="font-medium text-slate-900">
                          {selectedApplication.primaryContactName}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Email</p>
                        <p className="font-medium text-slate-900">
                          {selectedApplication.primaryContactEmail}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-slate-600">Phone</p>
                        <p className="font-medium text-slate-900">
                          {selectedApplication.primaryContactPhone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Review Form */}
                  <div className="space-y-4 border-t border-slate-200 pt-4">
                    <h3 className="font-semibold text-slate-900">Approval Details</h3>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Partner Tier
                      </label>
                      <select
                        value={reviewState.tier}
                        onChange={(e) =>
                          setReviewState({
                            ...reviewState,
                            tier: e.target.value as "Gold" | "Silver" | "Bronze" | "Standard",
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Standard">Standard</option>
                        <option value="Bronze">Bronze</option>
                        <option value="Silver">Silver</option>
                        <option value="Gold">Gold</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Commission Rate (%)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={reviewState.commissionRate}
                          onChange={(e) =>
                            setReviewState({
                              ...reviewState,
                              commissionRate: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Annual MDF Budget ($)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step="1000"
                          value={reviewState.mdfBudgetAnnual}
                          onChange={(e) =>
                            setReviewState({
                              ...reviewState,
                              mdfBudgetAnnual: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!showRejectForm ? (
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      <Button
                        onClick={handleApprove}
                        disabled={loading}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Approve Partner
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => setShowRejectForm(true)}
                        disabled={loading}
                        variant="outline"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-900">Reject Application</h4>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide a reason for rejection..."
                        rows={3}
                        className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleReject}
                          disabled={loading || !rejectionReason.trim()}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Rejecting...
                            </>
                          ) : (
                            "Confirm Rejection"
                          )}
                        </Button>
                        <Button
                          onClick={() => setShowRejectForm(false)}
                          disabled={loading}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-slate-600">
                    Select an application to review
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
