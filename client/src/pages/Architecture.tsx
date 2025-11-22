import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Database, 
  Network, 
  Cpu, 
  Clock, 
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
  Download,
  Layers,
  GitBranch,
  Activity
} from "lucide-react";

export default function Architecture() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const architectureComponents = [
    {
      id: "data-sources",
      title: "Data Sources & Ingestion",
      icon: Activity,
      color: "from-blue-500 to-cyan-500",
      description: "Multi-source data ingestion from diverse systems",
      details: [
        "SCADA & IoT sensor networks (real-time)",
        "Video surveillance feeds (1,000+ cameras)",
        "Network logs & traffic data",
        "Crime databases & incident reports",
        "CVE/CVSS vulnerability feeds",
        "Weather & environmental sensors"
      ],
      technical: "High-throughput ingestion supporting 100,000+ events/second with schema-on-read flexibility"
    },
    {
      id: "kafka",
      title: "Kafka Ecosystem",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      description: "Real-time event streaming and message brokering",
      details: [
        "Distributed event streaming platform",
        "Topic-based message organization",
        "Exactly-once semantics guarantee",
        "Horizontal scalability",
        "Fault-tolerant replication",
        "Stream processing with Kafka Streams"
      ],
      technical: "Kafka serves as the central nervous system, enabling real-time data flow between all platform components with millisecond latency"
    },
    {
      id: "neo4j",
      title: "Neo4j Graph Database",
      icon: Network,
      color: "from-green-500 to-teal-500",
      description: "Patented Scalable Multi-Layered Graph Database",
      details: [
        "Subject-predicate-object relationship modeling",
        "20 QPS pathfinding performance (vs 5 QPS traditional)",
        "3D utility network representation",
        "Co-offending network analysis",
        "Link prediction algorithms",
        "Cypher query language for transparency"
      ],
      technical: "Neo4j's native graph storage enables complex relationship traversals in milliseconds, critical for real-time threat correlation and cascading failure analysis"
    },
    {
      id: "postgresql",
      title: "PostgreSQL Time-Series DB",
      icon: Database,
      color: "from-orange-500 to-red-500",
      description: "Persistent time-series data storage",
      details: [
        "High-performance relational storage",
        "Time-series optimization with TimescaleDB",
        "Historical trend analysis",
        "Audit trail persistence",
        "ACID compliance for data integrity",
        "Efficient aggregation queries"
      ],
      technical: "Dual database architecture combines Neo4j's relationship intelligence with PostgreSQL's time-series efficiency for complete analytical coverage"
    },
    {
      id: "tru-ai",
      title: "Tru-AI Agentic Engine",
      icon: Cpu,
      color: "from-indigo-500 to-purple-500",
      description: "Autonomous AI agents for intelligent automation",
      details: [
        "Iterative multi-step planning",
        "Autonomous workflow execution",
        "AI-powered icon generation",
        "Behavioral anomaly detection",
        "Predictive maintenance models",
        "Self-optimizing algorithms"
      ],
      technical: "Agentic AI agents autonomously plan, execute, and adapt workflows—from generating custom icons to orchestrating complex incident investigations across multiple data sources"
    },
    {
      id: "trutime",
      title: "TruTime Contextualization",
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
      description: "Temporal sequencing and event correlation",
      details: [
        "Precise timestamp synchronization",
        "Event sequence reconstruction",
        "Temporal pattern recognition",
        "Cascading failure tracing",
        "Historical context enrichment",
        "Time-based anomaly detection"
      ],
      technical: "TruTime sequences events across disparate systems with microsecond precision, enabling accurate root cause analysis and predictive modeling"
    },
    {
      id: "tru-insight",
      title: "Tru-InSight Video AI",
      icon: Shield,
      color: "from-pink-500 to-rose-500",
      description: "Autonomous video intelligence and analytics",
      details: [
        "Real-time face recognition",
        "License plate detection (ALPR)",
        "Behavioral analytics",
        "Multi-camera event correlation",
        "Autonomous investigation planning",
        "Threat alerting automation"
      ],
      technical: "Tru-InSight agents autonomously analyze video feeds, plan multi-step investigations, and correlate events across camera networks without human intervention"
    },
    {
      id: "dashboards",
      title: "Interactive Dashboards",
      icon: Layers,
      color: "from-cyan-500 to-blue-500",
      description: "Real-time visualization and control interfaces",
      details: [
        "Graph visualization (3D network views)",
        "Geospatial mapping integration",
        "Real-time threat dashboards",
        "Custom KPI monitoring",
        "Drill-down investigation tools",
        "Audit trail transparency"
      ],
      technical: "Dashboards provide real-time visibility into graph relationships, geospatial patterns, and temporal trends with sub-second refresh rates"
    }
  ];

  const dataFlow = [
    { from: "Data Sources", to: "Kafka Ecosystem", label: "Real-time ingestion" },
    { from: "Kafka Ecosystem", to: "Neo4j Graph DB", label: "Relationship modeling" },
    { from: "Kafka Ecosystem", to: "PostgreSQL", label: "Time-series storage" },
    { from: "Neo4j Graph DB", to: "Tru-AI Engine", label: "Graph analytics" },
    { from: "PostgreSQL", to: "TruTime", label: "Temporal sequencing" },
    { from: "Tru-AI Engine", to: "Dashboards", label: "AI insights" },
    { from: "TruTime", to: "Dashboards", label: "Contextualized events" },
    { from: "Tru-InSight", to: "Neo4j Graph DB", label: "Video event correlation" }
  ];

  const keyAdvantages = [
    {
      title: "Dual Database Architecture",
      description: "Neo4j for relationship intelligence + PostgreSQL for time-series efficiency delivers complete analytical coverage",
      metric: "20 QPS pathfinding vs 5 QPS traditional"
    },
    {
      title: "Agentic AI Automation",
      description: "Autonomous agents plan and execute complex workflows without human intervention, from icon generation to threat investigation",
      metric: "90% reduction in manual analysis time"
    },
    {
      title: "Real-Time Processing",
      description: "Kafka-based event streaming enables millisecond-latency data flow across all platform components",
      metric: "100,000+ events/second throughput"
    },
    {
      title: "Temporal Contextualization",
      description: "TruTime sequences events with microsecond precision for accurate root cause analysis and predictive modeling",
      metric: "75% faster incident investigation"
    },
    {
      title: "Defense-Grade Provenance",
      description: "Full audit trails with geolocation, timestamps, and approval chains ensure transparency and accountability",
      metric: "100% compliance with NIST/NERC"
    },
    {
      title: "Cyber-Physical Integration",
      description: "Correlates cyber threats (CVE/CVSS) with physical infrastructure for comprehensive security posture",
      metric: "Zero cascading failures in 18 months"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <GitBranch className="h-4 w-4 mr-2" />
              Technical Architecture
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              TruContext <span className="text-primary">Platform Architecture</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Explore the patented Scalable Multi-Layered Graph Database architecture that powers TruContext's industry-leading performance. Our dual database design combines Neo4j's relationship intelligence with PostgreSQL's time-series efficiency, orchestrated by Kafka event streaming and enhanced by agentic AI automation.
            </p>
            <div className="flex gap-4">
              <Link href="/demo">
                <Button size="lg" className="bg-primary text-white">
                  Schedule Technical Deep Dive
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                <Download className="h-5 w-5 mr-2" />
                Download Architecture Whitepaper
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Architecture Diagram */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Interactive Architecture Diagram</h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Click on any component to explore its role in the TruContext ecosystem
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {architectureComponents.map((component) => {
              const Icon = component.icon;
              const isActive = activeComponent === component.id;
              
              return (
                <Card 
                  key={component.id}
                  className={`cursor-pointer transition-all hover:shadow-xl ${
                    isActive ? 'ring-4 ring-primary shadow-2xl scale-105' : ''
                  }`}
                  onClick={() => setActiveComponent(isActive ? null : component.id)}
                >
                  <CardContent className="p-6">
                    <div className={`h-16 w-16 rounded-lg bg-gradient-to-br ${component.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{component.title}</h3>
                    <p className="text-sm text-gray-600">{component.description}</p>
                    {isActive && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs font-semibold text-primary mb-2">TECHNICAL DETAILS</div>
                        <ul className="space-y-1">
                          {component.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                              <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-700 italic">
                          {component.technical}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Data Flow Visualization */}
          <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-primary/20">
            <CardContent className="p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Data Flow Architecture</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {dataFlow.map((flow, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow">
                    <div className="text-sm font-semibold text-gray-700">{flow.from}</div>
                    <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="text-sm font-semibold text-gray-700">{flow.to}</div>
                    <Badge variant="outline" className="ml-auto text-xs">{flow.label}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Architectural Advantages */}
      <section className="py-12 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container max-w-6xl">
          <h2 className="text-4xl font-bold mb-4 text-center">Architectural Advantages</h2>
          <p className="text-xl opacity-90 mb-12 text-center max-w-3xl mx-auto">
            Six core architectural innovations that deliver superior performance and capabilities
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyAdvantages.map((advantage, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
                  <p className="text-sm opacity-90 mb-4">{advantage.description}</p>
                  <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                    <div className="text-2xl font-bold">{advantage.metric}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Technical Specifications</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-primary mb-6">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Graph Query Performance</span>
                    <span className="font-bold text-gray-900">20 QPS</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Event Ingestion Throughput</span>
                    <span className="font-bold text-gray-900">100K+ events/sec</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Dashboard Refresh Rate</span>
                    <span className="font-bold text-gray-900">&lt;1 second</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Video AI Processing</span>
                    <span className="font-bold text-gray-900">1,200+ streams</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Temporal Precision</span>
                    <span className="font-bold text-gray-900">Microsecond</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">System Uptime</span>
                    <span className="font-bold text-gray-900">99.97%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-primary mb-6">Integration Capabilities</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">RESTful API & GraphQL endpoints</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">SCADA protocol support (Modbus, DNP3, OPC UA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">SIEM integration (Splunk, QRadar, ArcSight)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Cloud-native deployment (AWS, Azure, GCP)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">On-premises & hybrid configurations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">MITRE ATT&CK framework integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">CVE/CVSS vulnerability feeds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Custom connector development SDK</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Experience the Architecture?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Schedule a technical deep dive with our architects to explore how TruContext's patented architecture can transform your operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-primary text-white">
                Schedule Technical Demo
              </Button>
            </Link>
            <Link href="/why/advantages">
              <Button size="lg" variant="outline">
                View Platform Advantages
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
