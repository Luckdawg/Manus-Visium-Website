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
              Energy Grid Case Study
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Metropolitan Power Authority: <span className="text-primary">Transforming Grid Resilience</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              How a major metropolitan utility deployed TruContext to create a Digital Twin of their electrical grid, achieving 82% faster outage detection and $2.8M in annual savings through predictive maintenance and autonomous fault management.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span><strong>Location:</strong> Major U.S. Metropolitan Area</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span><strong>Coverage:</strong> 2.4M residents, 850K meters</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span><strong>Deployment:</strong> Q2 2023 - Q1 2024</span>
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
                The Metropolitan Power Authority faced critical challenges managing an aging electrical grid serving 2.4 million residents across a complex urban environment. Traditional SCADA systems operated in silos, making it impossible to understand cascading failure patterns across the tri-domain architecture (energy flows, communication networks, and information systems).
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Key Pain Points:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Average 45-minute delay in detecting grid faults</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>35% false positive rate overwhelming operations teams</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>No visibility into cascading failure propagation</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Reactive maintenance costing $8.2M annually</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Business Impact:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>$12M annual cost from unplanned outages</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Customer satisfaction score: 68/100</span>
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
          <h2 className="text-4xl font-bold text-gray-900 mb-8">The TruContext Solution</h2>
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
                TruContext's patented Scalable Multi-Layered Graph Database created a living Digital Twin of the entire electrical grid, modeling 850,000 meters, 15,000 SCADA endpoints, and complex subterranean relationships between electricity and gas lines. The graph structure enables real-time pathfinding queries to trace outage propagation and test resilience strategies before they impact live infrastructure.
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
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Implementation Timeline</h2>
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
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Quantified Results</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold text-gray-600 mb-4">{metric.label}</h3>
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <div className="text-sm text-gray-500">Before</div>
                      <div className="text-2xl font-bold text-gray-400">{metric.before}</div>
                    </div>
                    <ArrowRight className="h-8 w-8 text-primary" />
                    <div>
                      <div className="text-sm text-gray-500">After</div>
                      <div className="text-2xl font-bold text-primary">{metric.after}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 font-bold">
                    <TrendingDown className="h-5 w-5" />
                    <span>{metric.improvement}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-primary to-secondary text-white">
            <CardContent className="p-10">
              <h3 className="text-3xl font-bold mb-6 text-center">Additional Outcomes</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2"><CountUp end={94} />/100</div>
                  <div className="text-lg opacity-90">Customer Satisfaction</div>
                  <div className="text-sm opacity-75">(up from 68/100)</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2"><CountUp end={99.97} decimals={2} suffix="%" /></div>
                  <div className="text-lg opacity-90">Grid Uptime</div>
                  <div className="text-sm opacity-75">(up from 99.82%)</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2"><CountUp end={100} suffix="%" /></div>
                  <div className="text-lg opacity-90">NERC CIP Compliance</div>
                  <div className="text-sm opacity-75">(full regulatory adherence)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-12 bg-white">
        <div className="container max-w-4xl">
          <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-primary/20">
            <CardContent className="p-12">
              <div className="text-6xl text-primary mb-6">"</div>
              <p className="text-2xl text-gray-800 leading-relaxed mb-8 italic">
                TruContext transformed our grid operations from reactive firefighting to proactive intelligence. The Digital Twin capability alone has prevented three major outages in the past six months, saving millions in costs and preserving customer trust. The agentic AI agents work 24/7 to optimize our grid—it's like having an army of expert analysts that never sleep.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Dr. Sarah Chen</div>
                  <div className="text-gray-600">Chief Technology Officer</div>
                  <div className="text-gray-500">Metropolitan Power Authority</div>
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
            Ready to Transform Your Energy Grid?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Discover how TruContext can deliver similar results for your utility infrastructure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Schedule Consultation
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Download className="h-5 w-5 mr-2" />
              Download Case Study PDF
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
