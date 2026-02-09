import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, FileText, Video, BookOpen } from "lucide-react";

const resourceTypeIcons: Record<string, React.ReactNode> = {
  "Training Video": <Video className="h-5 w-5" />,
  "Sales Collateral": <FileText className="h-5 w-5" />,
  "Technical Documentation": <BookOpen className="h-5 w-5" />,
  "Case Study": <FileText className="h-5 w-5" />,
  "Presentation": <FileText className="h-5 w-5" />,
  "Whitepaper": <BookOpen className="h-5 w-5" />,
  "Demo": <Video className="h-5 w-5" />,
  "Tool": <FileText className="h-5 w-5" />,
  "Other": <FileText className="h-5 w-5" />,
};

export default function PartnerResources() {
  const { user, loading: authLoading } = useAuth();
  const { data: resources, isLoading } = trpc.partner.getPartnerResources.useQuery(
    { limit: 50 },
    { enabled: !!user && user.role === "partner" }
  );

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Partner Resources</h1>
        <p className="text-gray-600">Access training materials, sales collateral, and technical documentation.</p>
      </div>

      {/* Resource Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {["Training Video", "Sales Collateral", "Technical Documentation", "Case Study"].map((category) => (
          <Card key={category} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mb-2">{resourceTypeIcons[category]}</div>
                <p className="font-medium text-sm">{category}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources && resources.length > 0 ? (
          resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{resource.resourceName}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{resource.resourceType}</p>
                  </div>
                  <div className="text-gray-400">
                    {resourceTypeIcons[resource.resourceType] || <FileText className="h-5 w-5" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>

                <div className="space-y-2 mb-4 text-xs text-gray-500">
                  {resource.category && (
                    <p>
                      <span className="font-medium">Category:</span> {resource.category}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Access Level:</span> {resource.accessLevel}
                  </p>
                  {resource.fileSize && (
                    <p>
                      <span className="font-medium">Size:</span> {(resource.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Downloads:</span> {resource.downloadCount}
                  </p>
                </div>

                <Button
                  className="w-full gap-2"
                  onClick={() => {
                    if (resource.fileUrl) {
                      window.open(resource.fileUrl, "_blank");
                    }
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 mb-4">No resources available yet</p>
            <p className="text-sm text-gray-500">Check back soon for training materials and sales collateral.</p>
          </div>
        )}
      </div>
    </div>
  );
}
