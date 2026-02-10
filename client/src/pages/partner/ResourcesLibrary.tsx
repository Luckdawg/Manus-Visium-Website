import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AlertCircle, Download, Loader2, Search, FileText, Video, BookOpen, Award, Zap } from "lucide-react";

const RESOURCE_TYPES = [
  { value: "all", label: "All Resources" },
  { value: "Sales Collateral", label: "Sales Collateral", icon: Zap },
  { value: "Technical Documentation", label: "Technical Docs", icon: FileText },
  { value: "Training Video", label: "Training Videos", icon: Video },
  { value: "Whitepaper", label: "Whitepapers", icon: BookOpen },
  { value: "Case Study", label: "Case Studies", icon: Award },
];

const RESOURCE_ICONS: Record<string, any> = {
  "Sales Collateral": Zap,
  "Technical Documentation": FileText,
  "Training Video": Video,
  "Whitepaper": BookOpen,
  "Case Study": Award,
  "Presentation": FileText,
  "Demo": Video,
  "Tool": Zap,
};

export default function ResourcesLibrary() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: resourcesData, isLoading, error } = trpc.partner.getResources.useQuery({ partnerId: user?.id || 0 });
  const resources = resourcesData?.resources || [];

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">Please log in to access resources.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Filter resources
  const filteredResources = resources?.filter((resource: any) => {
    const matchesType = selectedType === "all" || resource.resourceType === selectedType;
    const matchesSearch = resource.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Partner Resources Library</h1>
          <p className="text-muted-foreground">Sales collateral, training materials, and documentation to help you succeed</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Search className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-2.5" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {RESOURCE_TYPES.map(type => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              onClick={() => setSelectedType(type.value)}
              size="sm"
              className="gap-2"
            >
              {type.icon && <type.icon className="h-4 w-4" />}
              {type.label}
            </Button>
          ))}
        </div>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">Error loading resources: {error.message}</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => {
              const ResourceIcon = RESOURCE_ICONS[resource.resourceType] || FileText;
              return (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <ResourceIcon className="h-8 w-8 text-primary flex-shrink-0" />
                      <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">
                        {resource.resourceType}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{resource.resourceName}</CardTitle>
                    <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    {resource.category && (
                      <div className="mb-3">
                        <span className="text-xs text-muted-foreground">Category: </span>
                        <span className="text-sm font-medium">{resource.category}</span>
                      </div>
                    )}
                    {resource.tags && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(typeof resource.tags === "string" ? JSON.parse(resource.tags) : resource.tags)?.map((tag: string) => (
                          <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {resource.downloadCount || 0} downloads
                    </div>
                  </CardContent>

                  <div className="px-6 py-4 border-t">
                    <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full gap-2" variant="default">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </a>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground mb-4">No resources found matching your search</p>
              <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedType("all"); }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Resource Categories Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Sales Collateral
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Datasheets, competitive positioning, ROI calculators, and customer case studies to help you close deals faster.
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Technical Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              API documentation, integration guides, deployment guides, and architecture diagrams for technical evaluations.
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="h-5 w-5" />
                Training & Certification
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Video tutorials, certification exams, webinars, and hands-on training to build your team's expertise.
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-5 w-4" />
                Marketing Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Co-branding assets, social media templates, email templates, and press releases for joint marketing campaigns.
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base">Need More Resources?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>We're constantly adding new resources to help you succeed. If you need something specific:</p>
            <p>• Contact your partner account manager</p>
            <p>• Email <strong>partners@visiumtechnologies.com</strong></p>
            <p>• Request custom materials for your specific customer needs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
