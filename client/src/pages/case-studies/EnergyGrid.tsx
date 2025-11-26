import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Zap, 
  CheckCircle2, 
  TrendingDown, 
  Clock, 
  Shield,
  Network,
  ArrowRight,
  Download,
  Calendar,
  MapPin,
  Users
} from "lucide-react";
import CountUp from "@/components/CountUp";

export default function EnergyGridCaseStudy() {
  const metrics = [
    { label: "Outage Detection Time", before: "45 minutes", after: "8 minutes", improvement: "82% faster" },
    { label: "False Positive Rate", before: "35%", after: "6%", improvement: "83% reduction" },
    { label: "Grid Resilience Score", before: "72/100", after: "94/100", improvement: "+31%" },
    { label: "Annual Cost Savings", before: "$0", after: "$2.8M", improvement: "ROI: 340%" }
  ];

  const timeline = [
    { phase: "Discovery & Planning", duration: "4 weeks", activities: ["Infrastructure assessment", "Stakeholder interviews", "Data source identification", "Integration planning"] },
    { phase: "Pilot Deployment", duration: "8 weeks", activities: ["Graph database setup", "SCADA integration", "IoT sensor connection", "Initial AI model training"] },
    { phase: "Full Rollout", duration: "12 weeks", activities: ["City-wide deployment", "Digital Twin creation", "Staff training", "Workflow automation"] },
    { phase: "Optimization", duration: "Ongoing", activities: ["Model refinement", "Feature expansion", "Performance tuning", "Continuous improvement"] }
  ];

  const technicalComponents = [
    {
      component: "Data Sources",
      items: ["SCADA logs (15,000+ endpoints)", "IoT sensor data (real-time)", "Electrical distribution models", "Communication network logs", "Weather data feeds"]
    },
    {
      component: "TruContext Integration",
      items: ["Neo4j graph database (3D utility network)", "PostgreSQL (time-series data)", "Kafka ecosystem (event streaming)", "Tru-AI agents (fault prediction)", "TruTime (temporal correlation)"]
    },
    {
      component: "Key Capabilities",
      items: ["Digital Twin simulation", "Real-time fault correlation", "Predictive outage modeling", "Automated rerouting", "CVE/vulnerability mapping"]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
              <Zap className="h-4 w-4 mr-2" />
              Energy Grid Use Case
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Metropolitan Power Authority: <span className="text-primary">Transforming Grid Resilience</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Explore how a major metropolitan utility could deploy TruContext to create a Digital Twin of their electrical grid, potentially achieving 82% faster outage detection and $2.8M in annual savings through predictive maintenance and autonomous fault management.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span><strong>Scenario:</strong> Major U.S. Metropolitan Area</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span><strong>Potential Coverage:</strong> 2.4M residents, 850K meters</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span><strong>Estimated Timeline:</strong> 24-week deployment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">The Challenge</h2>
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
            <CardContent className="p-10">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Metropolitan power authorities often face critical challenges managing aging electrical grids serving millions of residents across complex urban environments. Traditional SCADA systems typically operate in silos, making it difficult to understand cascading failure patterns across tri-domain architectures (energy flows, communication networks, and information systems).
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Common Pain Points:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Average 45-minute delays in detecting grid faults</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>35% false positive rates overwhelming operations teams</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Limited visibility into cascading failure propagation</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Reactive maintenance costing millions annually</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Potential Business Impact:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Millions in annual costs from unplanned outages</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Declining customer satisfaction scores</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Regulatory compliance concerns (NERC CIP)</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Increasing cyber-physical threat exposure</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">How TruContext Could Transform Grid Operations</h2>
          <div className="space-y-6">
            {technicalComponents.map((component, index) => (
              <Card key={index} className="bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-primary mb-4">{component.component}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {component.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-gradient-to-br from-primary to-secondary text-white">
            <CardContent className="p-10">
              <h3 className="text-2xl font-bold mb-4">Digital Twin Architecture</h3>
              <p className="text-lg opacity-90 leading-relaxed mb-6">
                TruContext's patented Scalable Multi-Layered Graph Database would create a living Digital Twin of the entire electrical grid, modeling hundreds of thousands of meters, SCADA endpoints, and complex subterranean relationships between electricity and gas lines. The graph structure would enable real-time pathfinding queries to trace outage propagation and test resilience strategies before they impact live infrastructure.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <Network className="h-8 w-8 mb-2" />
                  <div className="font-bold mb-1">Graph Modeling</div>
                  <div className="text-sm opacity-90">3D utility network with subject-predicate-object relationships</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <Zap className="h-8 w-8 mb-2" />
                  <div className="font-bold mb-1">Real-Time Simulation</div>
                  <div className="text-sm opacity-90">Co-simulations predict failure scenarios including cyber attacks</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <Shield className="h-8 w-8 mb-2" />
                  <div className="font-bold mb-1">Autonomous Agents</div>
                  <div className="text-sm opacity-90">Tru-AI optimizes energy flows and reroutes power during faults</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Potential Implementation Roadmap</h2>
          <div className="space-y-6">
            {timeline.map((phase, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-l-4 border-primary">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{phase.phase}</h3>
                      <div className="flex items-center gap-2 text-primary mt-2">
                        <Clock className="h-5 w-5" />
                        <span className="font-semibold">{phase.duration}</span>
                      </div>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Phase {index + 1}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {phase.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>{activity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Projected Outcomes</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="text-sm font-semibold text-primary mb-2">{metric.label}</div>
                  <div className="flex items-baseline gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Current</div>
                      <div className="text-2xl font-bold text-gray-400">{metric.before}</div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">With TruContext</div>
                      <div className="text-3xl font-bold text-green-600">{metric.after}</div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    {metric.improvement}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-white border-2 border-green-200">
            <CardContent className="p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Potential Value Delivered</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    <CountUp end={82} duration={2} />%
                  </div>
                  <div className="text-gray-700">Faster outage detection through AI-powered correlation</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    $<CountUp end={2.8} decimals={1} duration={2} />M
                  </div>
                  <div className="text-gray-700">Estimated annual savings from predictive maintenance</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    <CountUp end={340} duration={2} />%
                  </div>
                  <div className="text-gray-700">Projected ROI within first year</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Capabilities Section */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">How TruContext Would Enable These Outcomes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Predictive Fault Detection</h3>
                <p className="text-gray-700 leading-relaxed">
                  Tru-AI agents would continuously analyze SCADA logs, IoT sensor data, and weather patterns to predict equipment failures before they occur, enabling proactive maintenance and preventing cascading outages.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Network className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Digital Twin Simulation</h3>
                <p className="text-gray-700 leading-relaxed">
                  The graph-based Digital Twin would model complex interdependencies between electrical, communication, and control systems, allowing operators to test "what-if" scenarios and optimize grid resilience strategies.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Autonomous Response</h3>
                <p className="text-gray-700 leading-relaxed">
                  When faults are detected, Tru-AI agents could automatically reroute power flows, isolate affected sections, and restore service—reducing mean time to recovery from hours to minutes.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Clock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Correlation</h3>
                <p className="text-gray-700 leading-relaxed">
                  TruTime's temporal analysis would correlate events across thousands of data sources in real-time, dramatically reducing false positives and helping operators focus on genuine threats.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Grid Operations?</h2>
          <p className="text-xl opacity-90 mb-8 leading-relaxed">
            Discover how TruContext could help your utility achieve similar outcomes through predictive maintenance, autonomous fault management, and Digital Twin simulation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="gap-2">
                Schedule a Demo
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/why/roi">
              <Button size="lg" variant="outline" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Download className="h-5 w-5" />
                Calculate Your ROI
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
