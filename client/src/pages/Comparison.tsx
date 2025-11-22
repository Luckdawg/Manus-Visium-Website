import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  CheckCircle2, 
  X,
  Minus,
  ArrowRight,
  Download,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";

export default function Comparison() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Features" },
    { id: "architecture", label: "Architecture" },
    { id: "ai", label: "AI & Automation" },
    { id: "performance", label: "Performance" },
    { id: "security", label: "Security & Compliance" },
    { id: "integration", label: "Integration" }
  ];

  const comparisonData = [
    {
      category: "architecture",
      feature: "Graph Database Architecture",
      trucontext: { status: "full", detail: "Patented Scalable Multi-Layered Graph Database (Neo4j)" },
      traditional: { status: "none", detail: "Relational databases only" },
      advantage: "20 QPS pathfinding vs 5 QPS traditional - 4x faster relationship queries"
    },
    {
      category: "architecture",
      feature: "Dual Database Persistence",
      trucontext: { status: "full", detail: "Neo4j (relationships) + PostgreSQL (time-series)" },
      traditional: { status: "partial", detail: "Single database architecture" },
      advantage: "Best-of-both-worlds: relationship intelligence + time-series efficiency"
    },
    {
      category: "architecture",
      feature: "Real-Time Event Streaming",
      trucontext: { status: "full", detail: "Kafka ecosystem with 100K+ events/sec" },
      traditional: { status: "partial", detail: "Batch processing or limited streaming" },
      advantage: "Millisecond-latency data flow across all components"
    },
    {
      category: "ai",
      feature: "Agentic AI Capabilities",
      trucontext: { status: "full", detail: "Autonomous agents with iterative multi-step planning" },
      traditional: { status: "none", detail: "Rule-based automation only" },
      advantage: "90% reduction in manual analysis time through autonomous workflows"
    },
    {
      category: "ai",
      feature: "AI-Powered Icon Generation",
      trucontext: { status: "full", detail: "Automatic custom icon creation for entities" },
      traditional: { status: "none", detail: "Manual icon management" },
      advantage: "Instant visual representation of new entities and threats"
    },
    {
      category: "ai",
      feature: "Video Intelligence (Tru-InSight)",
      trucontext: { status: "full", detail: "Autonomous video AI with behavioral analytics" },
      traditional: { status: "partial", detail: "Basic motion detection only" },
      advantage: "Real-time behavioral anomaly detection across 1,200+ camera feeds"
    },
    {
      category: "ai",
      feature: "Predictive Analytics",
      trucontext: { status: "full", detail: "ML models for threat prediction & link analysis" },
      traditional: { status: "partial", detail: "Limited statistical analysis" },
      advantage: "78% crime prevention rate vs 52% traditional"
    },
    {
      category: "performance",
      feature: "Query Performance",
      trucontext: { status: "full", detail: "20 QPS for complex pathfinding queries" },
      traditional: { status: "partial", detail: "5 QPS for similar queries" },
      advantage: "4x faster relationship traversal and threat correlation"
    },
    {
      category: "performance",
      feature: "Temporal Contextualization",
      trucontext: { status: "full", detail: "TruTime with microsecond precision" },
      traditional: { status: "partial", detail: "Basic timestamp correlation" },
      advantage: "75% faster incident investigation through precise event sequencing"
    },
    {
      category: "performance",
      feature: "Scalability",
      trucontext: { status: "full", detail: "Horizontal scaling to millions of nodes" },
      traditional: { status: "partial", detail: "Vertical scaling limitations" },
      advantage: "Linear performance scaling with data growth"
    },
    {
      category: "security",
      feature: "MITRE ATT&CK Integration",
      trucontext: { status: "full", detail: "Native MITRE framework mapping with heritage" },
      traditional: { status: "partial", detail: "Manual MITRE mapping required" },
      advantage: "Automatic threat technique identification and correlation"
    },
    {
      category: "security",
      feature: "CVE/CVSS Risk Mapping",
      trucontext: { status: "full", detail: "Automated vulnerability correlation with infrastructure" },
      traditional: { status: "partial", detail: "Separate vulnerability scanning tools" },
      advantage: "Cyber-physical threat correlation prevents cascading failures"
    },
    {
      category: "security",
      feature: "Defense-Grade Provenance",
      trucontext: { status: "full", detail: "Full audit trails with geolocation & timestamps" },
      traditional: { status: "partial", detail: "Basic logging" },
      advantage: "100% compliance with NIST, NERC CIP, and regulatory requirements"
    },
    {
      category: "security",
      feature: "Ethical Transparency",
      trucontext: { status: "full", detail: "Explainable AI with Cypher query visibility" },
      traditional: { status: "none", detail: "Black box algorithms" },
      advantage: "Full transparency for predictive policing and governance applications"
    },
    {
      category: "integration",
      feature: "SCADA/IoT Integration",
      trucontext: { status: "full", detail: "Native support for Modbus, DNP3, OPC UA" },
      traditional: { status: "partial", detail: "Limited industrial protocol support" },
      advantage: "Direct integration with critical infrastructure systems"
    },
    {
      category: "integration",
      feature: "SIEM Compatibility",
      trucontext: { status: "full", detail: "Splunk, QRadar, ArcSight connectors" },
      traditional: { status: "full", detail: "Standard SIEM integration" },
      advantage: "Augments existing SIEM with graph analytics and AI"
    },
    {
      category: "integration",
      feature: "Digital Twin Capability",
      trucontext: { status: "full", detail: "3D utility network simulation & co-simulation" },
      traditional: { status: "none", detail: "No digital twin support" },
      advantage: "Test resilience strategies before impacting live infrastructure"
    },
    {
      category: "integration",
      feature: "Cloud & On-Premises Deployment",
      trucontext: { status: "full", detail: "AWS, Azure, GCP, hybrid, air-gapped" },
      traditional: { status: "partial", detail: "Cloud-only or on-premises only" },
      advantage: "Flexible deployment for any security posture"
    }
  ];

  const filteredData = selectedCategory === "all" 
    ? comparisonData 
    : comparisonData.filter(item => item.category === selectedCategory);

  const renderStatus = (status: string) => {
    switch (status) {
      case "full":
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case "partial":
        return <Minus className="h-6 w-6 text-yellow-600" />;
      case "none":
        return <X className="h-6 w-6 text-red-600" />;
      default:
        return null;
    }
  };

  const keyDifferentiators = [
    {
      title: "4x Faster Queries",
      description: "20 QPS vs 5 QPS for complex relationship traversal",
      icon: Zap,
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Agentic AI",
      description: "Autonomous agents vs rule-based automation",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "MITRE Heritage",
      description: "Native ATT&CK integration with framework origins",
      icon: Shield,
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <ArrowRight className="h-4 w-4 mr-2" />
              Competitive Comparison
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              TruContext vs <span className="text-primary">Traditional SIEM Platforms</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              See how TruContext's patented graph database architecture, agentic AI capabilities, and MITRE heritage deliver superior performance compared to traditional SIEM and analytics platforms. Our dual database design and autonomous agents provide capabilities that legacy systems simply cannot match.
            </p>
            <div className="flex gap-4">
              <Link href="/demo">
                <Button size="lg" className="bg-primary text-white">
                  Schedule Comparison Demo
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                <Download className="h-5 w-5 mr-2" />
                Download Comparison Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-12 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container max-w-6xl">
          <h2 className="text-4xl font-bold mb-12 text-center">Key Differentiators</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {keyDifferentiators.map((diff, index) => {
              const Icon = diff.icon;
              return (
                <Card key={index} className="bg-white/10 backdrop-blur border-white/20">
                  <CardContent className="p-8 text-center">
                    <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${diff.color} flex items-center justify-center mx-auto mb-6`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{diff.title}</h3>
                    <p className="text-lg opacity-90">{diff.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Feature-by-Feature Comparison</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id ? "bg-primary text-white" : ""}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 pb-4 border-b-2 border-gray-300 font-bold text-gray-900">
              <div className="col-span-4">Feature</div>
              <div className="col-span-3 text-center">TruContext</div>
              <div className="col-span-3 text-center">Traditional SIEM</div>
              <div className="col-span-2 text-center">Advantage</div>
            </div>

            {/* Rows */}
            {filteredData.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <div className="font-bold text-gray-900 mb-1">{item.feature}</div>
                      <Badge variant="outline" className="text-xs">
                        {categories.find(c => c.id === item.category)?.label}
                      </Badge>
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        {renderStatus(item.trucontext.status)}
                        <span className="text-sm font-semibold text-green-700">
                          {item.trucontext.status === "full" ? "Full Support" : 
                           item.trucontext.status === "partial" ? "Partial" : "Not Available"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 text-center">{item.trucontext.detail}</div>
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        {renderStatus(item.traditional.status)}
                        <span className="text-sm font-semibold text-gray-600">
                          {item.traditional.status === "full" ? "Full Support" : 
                           item.traditional.status === "partial" ? "Partial" : "Not Available"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 text-center">{item.traditional.detail}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="bg-primary/10 rounded-lg p-3 text-center">
                        <div className="text-xs font-semibold text-primary">{item.advantage}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Performance Comparison</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-primary mb-6">TruContext Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Graph Query Speed</span>
                    <span className="font-bold text-green-600">20 QPS</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Event Throughput</span>
                    <span className="font-bold text-green-600">100K+ events/sec</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">False Positive Rate</span>
                    <span className="font-bold text-green-600">6-9%</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Mean Time to Detect (MTTD)</span>
                    <span className="font-bold text-green-600">75% reduction</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Analyst Time Savings</span>
                    <span className="font-bold text-green-600">90%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-600 mb-6">Traditional SIEM Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Graph Query Speed</span>
                    <span className="font-bold text-red-600">5 QPS</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Event Throughput</span>
                    <span className="font-bold text-yellow-600">20-50K events/sec</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">False Positive Rate</span>
                    <span className="font-bold text-red-600">35-41%</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Mean Time to Detect (MTTD)</span>
                    <span className="font-bold text-yellow-600">Baseline</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Analyst Time Savings</span>
                    <span className="font-bold text-red-600">Minimal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Comparison */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Return on Investment</h2>
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
            <CardContent className="p-10">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">340%</div>
                  <div className="text-lg text-gray-700">Average ROI</div>
                  <div className="text-sm text-gray-600">Within 18 months</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">$2.8M</div>
                  <div className="text-lg text-gray-700">Annual Savings</div>
                  <div className="text-sm text-gray-600">Per customer average</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">6 months</div>
                  <div className="text-lg text-gray-700">Payback Period</div>
                  <div className="text-sm text-gray-600">Typical deployment</div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">Cost Savings Sources:</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">90% reduction in manual analysis time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">75% faster incident resolution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">83% reduction in false positives</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">50% lower infrastructure maintenance costs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Prevented cascading failures (priceless)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Improved regulatory compliance</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">
            See the Difference for Yourself
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Schedule a side-by-side comparison demo to experience TruContext's superior capabilities firsthand
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Schedule Comparison Demo
              </Button>
            </Link>
            <Link href="/why/roi">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Calculate Your ROI
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
