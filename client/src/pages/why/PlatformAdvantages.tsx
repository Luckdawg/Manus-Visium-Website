import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Network, 
  Brain, 
  Zap, 
  Shield, 
  GitBranch, 
  Clock, 
  Database,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Layers,
  Eye,
  Target
} from "lucide-react";

export default function PlatformAdvantages() {
  const coreAdvantages = [
    {
      icon: <Database className="h-8 w-8" />,
      title: "Graph Database Architecture",
      description: "Patented Scalable Multi-Layered Graph Database Solution with Labelled Property Graph (LPG) framework delivers 20 queries per second for complex relationships—4x faster than traditional relational databases.",
      metrics: "20 QPS vs 5 QPS",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Agentic AI Capabilities",
      description: "Tru-AI engine enables autonomous reasoning, iterative planning, and predictive scenario generation. AI agents proactively detect anomalies, automate threat mitigation, and solve multi-step urban challenges with minimal human intervention.",
      metrics: "Autonomous Intelligence",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-Time Data Processing",
      description: "Kafka Ecosystem integration provides rapid, high-throughput, scalable processing of massive event streams from hundreds of sources, meeting the dynamic demands of modern smart cities.",
      metrics: "Millisecond Response",
      color: "from-cyan-500 to-teal-500"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Temporal Contextualization",
      description: "TruTime interactive timeline links events sequentially to understand how incidents unfolded and what changed at specific points, accelerating root cause analysis and incident response.",
      metrics: "Causal Event Tracing",
      color: "from-teal-500 to-green-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Defense-Grade Provenance",
      description: "Enhanced commercialized version of MITRE's Cygraph cyber tool, designed for DoD and Army Cyber command. Inherently optimized for resilience, threat analysis, and operation in high-risk networked environments.",
      metrics: "MITRE Heritage",
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: <GitBranch className="h-8 w-8" />,
      title: "Complete Data Fusion",
      description: "Multi-source data fusion integrates network traffic (PCAP), vulnerability tools (Tenable), and log management (Splunk/Datadog) with complete overlay capability to break down operational data silos.",
      metrics: "Unified Intelligence",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const keyDifferentiators = [
    {
      title: "Cyber-Physical Integration",
      description: "TruContext bridges IT security log data with Operational Technology (OT) sensor data, identifying external network entries and mapping them to vulnerable physical assets. This transforms reactive incident response into proactive threat hunting within critical municipal networks.",
      icon: <Network className="h-12 w-12 text-primary" />
    },
    {
      title: "Digital Twin Capability",
      description: "Continuous real-time data ingestion mapped to highly accurate graph models enables co-simulations that predict failure propagation and test resilience strategies against various scenarios—including cyber attacks—before they impact live infrastructure.",
      icon: <Layers className="h-12 w-12 text-primary" />
    },
    {
      title: "Architectural Transparency",
      description: "Unlike \"black box\" AI algorithms, TruContext's knowledge graph provides structurally visible, traceable relationships with full audit trails including geolocation, timestamps, and approval trails. This fulfills the ethical mandate for clarity in data-driven governance.",
      icon: <Eye className="h-12 w-12 text-primary" />
    }
  ];

  const applicationDomains = [
    {
      domain: "Energy Grid Optimization & Resilience",
      icon: <Zap className="h-10 w-10" />,
      focus: "Cyber-Physical Grid Resilience",
      capabilities: [
        "Tri-domain smart grid architecture modeling (energy, communication, information)",
        "Real-time fault correlation and outage management",
        "Digital Twin functionality for predictive failure simulation",
        "Autonomous energy flow optimization and rerouting during faults"
      ],
      outcomes: [
        "Reduced outage management time",
        "Enhanced grid security and asset integrity",
        "Predictive downtime minimization"
      ],
      color: "bg-gradient-to-br from-yellow-50 to-orange-50"
    },
    {
      domain: "Intelligent Transportation Systems (ITS)",
      icon: <Target className="h-10 w-10" />,
      focus: "Adaptive Traffic Control & Incident Response",
      capabilities: [
        "Spatio-temporal mobility contextualization with TruTime",
        "Rapid pathfinding for traffic light optimization",
        "Automated workflow dispatching to field services",
        "Tru-InSight AI agents for video-based anomaly detection"
      ],
      outcomes: [
        "Faster incident clearance time",
        "Optimized supply chain for infrastructure maintenance",
        "Autonomous congestion mitigation"
      ],
      color: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    {
      domain: "Public Safety & Predictive Policing",
      icon: <Shield className="h-10 w-10" />,
      focus: "Predictive Policing & Network Threat Hunting",
      capabilities: [
        "Co-offending network analysis and link prediction",
        "CVE/CVSS vulnerability grouping and risk prioritization",
        "Rapid threat isolation by OS, IP addresses, and subnets",
        "Ethical transparency with audit trails and explainable AI"
      ],
      outcomes: [
        "Higher crime prevention rate",
        "Mitigation of cascading cyber-physical failures",
        "Ethical, transparent predictions"
      ],
      color: "bg-gradient-to-br from-purple-50 to-pink-50"
    }
  ];

  const architecturalFeatures = [
    {
      challenge: "Fragmentation and Data Silos",
      solution: "Unified Data Fusion & Integration",
      mechanism: "API filtering and complete overlay of ingested data from multiple sources with agentic AI for automated query submission",
      outcome: "Autonomous silo-breaking workflows"
    },
    {
      challenge: "Big Data Velocity and Volume",
      solution: "Scalability & Real-Time Performance",
      mechanism: "Kafka Ecosystem integration with graph database efficiency and ML-driven predictive modeling",
      outcome: "Proactive, millisecond-level decision-making"
    },
    {
      challenge: "Cyber-Physical Threat Protection",
      solution: "Critical Infrastructure Security",
      mechanism: "MITRE Cygraph heritage with CVSS/CVE grouping and Tru-AI for autonomous threat isolation",
      outcome: "Superior threat hunting and risk prioritization"
    },
    {
      challenge: "Urban Network Complexity",
      solution: "Complex Interconnection Modeling",
      mechanism: "Patented Scalable Multi-Layered Graph Database with iterative AI planning for relationship mining",
      outcome: "Accurate connectivity assessment and pattern discovery"
    },
    {
      challenge: "Rapid Threat Isolation",
      solution: "Incident Response & Root Cause Analysis",
      mechanism: "TruTime interactive timeline with agentic reasoning for multi-step root cause tracing",
      outcome: "Accelerated incident isolation and resolution"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Urban Intelligence Platform
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              TruContext <span className="text-primary">Platform Advantages</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              An architectural shift from traditional relational data models toward highly scalable, relationship-focused graph databases—uniquely engineered to transform fragmented urban data into unified, actionable intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Core Advantages Grid */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Six Core Architectural Advantages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TruContext's patented architecture delivers unmatched performance, intelligence, and resilience for critical urban infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreAdvantages.map((advantage, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all border-2 border-transparent hover:border-primary/20">
                <CardContent className="p-8">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${advantage.color} text-white mb-6 group-hover:scale-110 transition-transform`}>
                    {advantage.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{advantage.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{advantage.description}</p>
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <TrendingUp className="h-5 w-5" />
                    <span>{advantage.metrics}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Strategic Differentiators
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What sets TruContext apart as the definitive urban intelligence platform
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {keyDifferentiators.map((diff, index) => (
              <Card key={index} className="bg-white hover:shadow-2xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">{diff.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{diff.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{diff.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge-Solution Matrix */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Smart City Challenges & TruContext Solutions
            </h2>
            <p className="text-xl text-gray-600">
              Architectural solutions aligned to critical urban infrastructure requirements
            </p>
          </div>

          <div className="space-y-6">
            {architecturalFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-l-4 border-primary">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-4 gap-6">
                    <div>
                      <div className="text-sm font-semibold text-gray-500 mb-2">CHALLENGE</div>
                      <div className="font-bold text-gray-900">{feature.challenge}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary mb-2">SOLUTION</div>
                      <div className="font-bold text-primary">{feature.solution}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500 mb-2">MECHANISM</div>
                      <div className="text-gray-700 text-sm leading-relaxed">{feature.mechanism}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-green-600 mb-2">OUTCOME</div>
                      <div className="font-semibold text-green-600">{feature.outcome}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Domains */}
      <section className="py-12 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Application Domains
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TruContext's versatility across critical urban infrastructure sectors
            </p>
          </div>

          <div className="space-y-8 max-w-6xl mx-auto">
            {applicationDomains.map((domain, index) => (
              <Card key={index} className={`${domain.color} border-2 border-gray-200 hover:shadow-2xl transition-all`}>
                <CardContent className="p-10">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="p-4 bg-white rounded-xl shadow-md text-primary">
                      {domain.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">{domain.domain}</h3>
                      <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-primary">{domain.focus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Key Capabilities
                      </h4>
                      <ul className="space-y-2">
                        {domain.capabilities.map((cap, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700">
                            <ArrowRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Measured Outcomes
                      </h4>
                      <ul className="space-y-2">
                        {domain.outcomes.map((outcome, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-green-700 font-semibold">
                            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl">
          <Card className="bg-gradient-to-br from-primary to-secondary text-white">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-6">
                  Transforming Passive Data into Active Guardians
                </h2>
                <p className="text-xl opacity-90 leading-relaxed">
                  TruContext represents an architectural shift toward highly scalable, relationship-focused graph databases, uniquely engineered to meet the demands of data-driven urbanism.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Core Value Proposition</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>Sophisticated data fusion with temporal and risk contextualization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>Cyber-Physical interoperability bridge essential for smart cities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>Agentic AI for autonomous reasoning and proactive intelligence</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Strategic Result</h3>
                  <p className="text-lg leading-relaxed">
                    Transforms fragmented urban data into <strong>unified, actionable intelligence</strong>, driving urban resilience and operational efficiency at scale across Energy Grids, Transportation Systems, and Public Safety operations.
                  </p>
                </div>
              </div>

              <div className="text-center space-x-4">
                <Link href="/demo">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                    Request Demo
                  </Button>
                </Link>
                <Link href="/why/roi">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Calculate ROI
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Urban Intelligence?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover how TruContext's patented architecture can drive resilience and efficiency across your critical infrastructure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Schedule Consultation
              </Button>
            </Link>
            <Link href="/platform">
              <Button size="lg" variant="outline">
                Explore Platform Features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
