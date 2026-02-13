import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, TrendingUp, Users, DollarSign, Edit2, Trash2, Save, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function PartnerDetails() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/admin/partners/:id");
  const partnerId = params?.id ? parseInt(params.id, 10) : null;

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch partner info
  const { data: partnerResponse, isLoading: partnerLoading } = trpc.partner.getPartner.useQuery(
    { partnerId: partnerId || 0 },
    { enabled: !!partnerId }
  );

  // Fetch partner deals
  const { data: dealsResponse, isLoading: dealsLoading, refetch: refetchDeals } = trpc.partner.getPartnerDeals.useQuery(
    { partnerId: partnerId || 0 },
    { enabled: !!partnerId }
  );

  // Mutations
  const updatePartnerMutation = trpc.partner.updatePartner.useMutation();
  const deletePartnerMutation = trpc.partner.deletePartner.useMutation();

  if (!match) return null;

  const partner = partnerResponse?.partner;
  const deals = dealsResponse?.deals || [];

  const handleEditClick = () => {
    if (partner) {
      setEditData({
        companyName: partner.companyName || "",
        primaryContactEmail: partner.primaryContactEmail || "",
        primaryContactPhone: partner.primaryContactPhone || "",
      });
      setIsEditMode(true);
    }
  };

  const handleSaveChanges = async () => {
    if (!partnerId || !editData) return;

    setIsSaving(true);
    try {
      await updatePartnerMutation.mutateAsync({
        partnerId,
        data: editData,
      });
      setIsEditMode(false);
      setEditData(null);
    } catch (error) {
      console.error("Failed to update partner:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePartner = async () => {
    if (!partnerId) return;

    setIsDeleting(true);
    try {
      await deletePartnerMutation.mutateAsync({ partnerId });
      navigate("/admin/partner-applications");
    } catch (error) {
      console.error("Failed to delete partner:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (partnerLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading partner details...</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">Partner not found</p>
          <Button onClick={() => navigate("/admin/partner-applications")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Partners
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/partner-applications")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{partner.companyName}</h1>
              <p className="text-muted-foreground">{partner.partnerType}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditMode ? (
              <>
                <Button variant="outline" onClick={handleEditClick}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditMode(false);
                    setEditData(null);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <Card className="mb-6 border-destructive bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Confirm Delete</CardTitle>
              <CardDescription>
                This action cannot be undone. All partner data, deals, and documents will be permanently deleted.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button
                variant="destructive"
                onClick={handleDeletePartner}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Partner"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Partner Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge>{partner.partnerStatus}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{partner.tier}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{deals.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">-</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deals">Deals ({deals.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Partner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditMode ? (
                  <>
                    <div>
                      <label className="text-sm font-medium">Company Name</label>
                      <Input
                        value={editData?.companyName || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            companyName: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contact Email</label>
                      <Input
                        type="email"
                        value={editData?.primaryContactEmail || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            primaryContactEmail: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contact Phone</label>
                      <Input
                        value={editData?.primaryContactPhone || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            primaryContactPhone: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Company Name</p>
                      <p className="text-lg font-semibold">{partner.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Email</p>
                      <p className="text-lg">{partner.primaryContactEmail || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Phone</p>
                      <p className="text-lg">{partner.primaryContactPhone || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <p className="text-lg">{partner.website || "-"}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deals Tab */}
          <TabsContent value="deals">
            <Card>
              <CardHeader>
                <CardTitle>Partner Deals</CardTitle>
                <CardDescription>
                  {deals.length} deal{deals.length !== 1 ? "s" : ""} registered
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dealsLoading ? (
                  <p className="text-muted-foreground">Loading deals...</p>
                ) : deals.length === 0 ? (
                  <p className="text-muted-foreground">No deals registered yet</p>
                ) : (
                  <div className="space-y-4">
                    {deals.map((deal: any) => (
                      <div
                        key={deal.id}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{deal.dealName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {deal.customerName} • {deal.dealStage}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ${parseFloat(deal.dealAmount || "0").toLocaleString()}
                            </p>
                            <Badge variant="outline">{deal.dealStage}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Supporting documents and files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <FileText className="mr-2 h-4 w-4" />
                  <p>No documents uploaded yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
