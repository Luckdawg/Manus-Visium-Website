import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GraphVisualization from "@/components/GraphVisualization";
import { 
  Network, 
  Zap, 
  Eye, 
  GitBranch,
  Shield,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { Link } from "wouter";

export default function GraphDemo() {
  const features = [
    {
      icon: Network,
      title: "Real-Time Correlation",
      description: "See how threats, assets, and vulnerabilities connect in real-time across your infrastructure"
    },
    {
      icon: Eye,
      title: "Visual Discovery",
      description: "Explore relationships visually to uncover hidden attack paths and security gaps"
    },
    {
      icon: GitBranch,
      title: "Multi-Hop Analysis",
      description: "Trace attack chains across multiple hops to understand blast radius and impact"
    },
    {
      icon: Zap,
      title: "Instant Insights",
      description: "Click any node to see detailed information, connections, and risk assessments"
    }
  ];

  const capabilities = [
    "Graph-based threat correlation",
    "Asset relationship mapping",
    "Vulnerability impact analysis",
    "Attack path visualization",
    "Risk propagation tracking",
    "Network topology mapping"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16">
        <div className="container">
          <div className="max-w-4xl">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              Interactive Demo
            </Badge>
            <h1 className="text-5xl font-bold mb-4">
              Experience TruContext Graph Intelligence
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Explore how TruContext's patented graph database technology maps relationships between threats, assets, and vulnerabilities to provide unparalleled security insights.
            </p>
            <div className="flex gap-4">
              <Link href="/demo">
                <Button size="lg" variant="secondary">
                  Schedule Full Demo
                </Button>
              </Link>
              <Link href="/platform">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Graph-Based Security Intelligence?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Interactive Graph Visualization
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Click on any node to explore connections. Drag to pan, use zoom controls to navigate. 
              This simplified demo shows how TruContext maps your security landscape.
            </p>
          </div>

          <GraphVisualization />

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">How to Use This Demo</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Click nodes</strong> to view detailed information about assets, threats, and vulnerabilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Observe relationships</strong> shown by connecting lines - red dashed lines indicate exploits, green lines show protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Use zoom controls</strong> to focus on specific areas or see the big picture</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Drag the canvas</strong> to pan and explore different parts of the network</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Enterprise-Grade Graph Analytics
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                TruContext's graph database architecture delivers 20 queries per second (QPS) compared to 
                just 5 QPS for traditional relational databases, enabling real-time threat correlation at scale.
              </p>
              <div className="space-y-3">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-1 bg-green-100 rounded">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-700">{capability}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h3 className="font-bold text-gray-900">Performance</h3>
                    </div>
                    <div className="text-4xl font-bold text-primary mb-1">4x Faster</div>
                    <p className="text-sm text-gray-600">Query performance vs. traditional databases</p>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Network className="h-5 w-5 text-primary" />
                      <h3 className="font-bold text-gray-900">Scale</h3>
                    </div>
                    <div className="text-4xl font-bold text-primary mb-1">Millions</div>
                    <p className="text-sm text-gray-600">Of nodes and relationships supported</p>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <h3 className="font-bold text-gray-900">Real-Time</h3>
                    </div>
                    <div className="text-4xl font-bold text-primary mb-1">&lt;100ms</div>
                    <p className="text-sm text-gray-600">Average query response time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to See TruContext in Action?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Schedule a personalized demo to see how TruContext can transform your security operations 
            with graph-based intelligence.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Schedule a Demo
              </Button>
            </Link>
            <Link href="/why/roi">
              <Button size="lg" variant="outline">
                Calculate Your ROI
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
