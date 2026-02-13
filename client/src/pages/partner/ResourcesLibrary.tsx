import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, ExternalLink, Search } from "lucide-react";

const resourceLibrary = [
  {
    id: 1,
    title: "TruContext Product Overview",
    category: "Sales Collateral",
    type: "PDF",
    size: "2.4 MB",
    url: "#",
  },
  {
    id: 2,
    title: "Competitive Positioning Guide",
    category: "Sales Collateral",
    type: "PDF",
    size: "1.8 MB",
    url: "#",
  },
  {
    id: 3,
    title: "API Integration Guide",
    category: "Technical",
    type: "PDF",
    size: "3.2 MB",
    url: "#",
  },
  {
    id: 4,
    title: "Deployment Best Practices",
    category: "Technical",
    type: "PDF",
    size: "2.1 MB",
    url: "#",
  },
];

export default function ResourcesLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Sales Collateral", "Technical", "Marketing"];

  const filteredResources = resourceLibrary.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Resource Library</h1>

      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id}>
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-base">{resource.title}</p>
                    <p className="text-xs text-gray-500 font-normal mt-1">{resource.category}</p>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{resource.type}</span>
                  <span>{resource.size}</span>
                </div>
                <Button className="w-full" variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No resources found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
