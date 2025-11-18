import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Car, 
  CheckCircle2, 
  TrendingDown, 
  Clock, 
  Camera,
  MapPin,
  ArrowRight,
  Download,
  Calendar,
  Users,
  Navigation
} from "lucide-react";

export default function IntelligentTransportationCaseStudy() {
  const metrics = [
    { label: "Incident Clearance Time", before: "28 minutes", after: "11 minutes", improvement: "61% faster" },
    { label: "Traffic Congestion", before: "42% peak hours", after: "19% peak hours", improvement: "55% reduction" },
    { label: "Emergency Response Time", before: "8.5 minutes", after: "5.2 minutes", improvement: "39% faster" },
    { label: "Infrastructure Maintenance Cost", before: "$4.2M/year", after: "$2.1M/year", improvement: "50% savings" }
  ];

  const timeline = [
    { phase: "Assessment & Design", duration: "6 weeks", activities: ["Traffic pattern analysis", "Camera network audit", "Sensor inventory", "Integration architecture design"] },
    { phase: "Pilot Corridor", duration: "10 weeks", activities: ["Deploy on 12-mile corridor", "Integrate 85 traffic cameras", "Connect 240 sensors", "Train Tru-InSight AI models"] },
    { phase: "City-Wide Rollout", duration: "16 weeks", activities: ["Expand to 180-mile network", "1,200+ camera integration", "Field service automation", "Staff training program"] },
    { phase: "Advanced Features", duration: "Ongoing", activities: ["Predictive maintenance", "ML model optimization", "Autonomous traffic control", "Real-time rerouting"] }
  ];

  const technicalComponents = [
    {
      component: "Data Sources",
      items: ["Traffic cameras (1,200+ feeds)", "Road sensor networks (3,500+ points)", "Vehicle telemetry data", "Mobile GPS reports", "Weather & incident feeds", "Field service logs"]
    },
    {
      component: "TruContext Integration",
      items: ["Graph pathfinding (transportation network)", "TruTime temporal sequencing", "Tru-InSight video AI agents", "Automated workflow dispatching", "Supply chain optimization", "Real-time anomaly detection"]
    },
    {
      component: "Key Capabilities",
      items: ["Behavioral anomaly detection", "Congestion prediction (ML)", "Multi-step action execution", "Traffic light optimization", "Incident investigation automation", "Predictive asset maintenance"]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-20">
        <div className="container">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-blue-500/10 text-blue-700 border-blue-500/20">
              <Car className="h-4 w-4 mr-2" />
              Intelligent Transportation Case Study
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Smart City Transit Authority: <span className="text-primary">Adaptive Traffic Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              How a major metropolitan transit authority deployed TruContext with Tru-InSight video AI to achieve 61% faster incident clearance, 55% congestion reduction, and $2.1M in annual infrastructure maintenance savings through spatio-temporal analytics and autonomous traffic management.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span><strong>Location:</strong> Major West Coast Metropolitan Area</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span><strong>Coverage:</strong> 1.8M residents, 180-mile network</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span><strong>Deployment:</strong> Q3 2023 - Q2 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">The Challenge</h2>
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
            <CardContent className="p-10">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The Smart City Transit Authority managed a complex 180-mile transportation network serving 1.8 million residents, but legacy systems couldn't correlate data from 1,200 traffic cameras, 3,500 sensors, and mobile GPS reports. Traffic incidents took an average of 28 minutes to clear, and reactive maintenance was costing $4.2M annually while infrastructure continued to deteriorate.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Operational Challenges:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Manual video review consuming 40+ analyst hours daily</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>No temporal correlation between sensor readings and incidents</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Reactive traffic light timing (no predictive optimization)</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Disconnected field service workflows causing delays</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Business Impact:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>$18M annual economic loss from congestion</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Citizen satisfaction: 61/100</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Emergency vehicle delays impacting public safety</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Aging infrastructure with no predictive maintenance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
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
              <h3 className="text-2xl font-bold mb-4">Tru-InSight Video Intelligence</h3>
              <p className="text-lg opacity-90 leading-relaxed mb-6">
                TruContext's Tru-InSight agentic AI autonomously analyzes 1,200 traffic camera feeds in real-time, performing face recognition, license plate detection, and behavioral analytics. AI agents iteratively plan multi-step investigations—such as tracing event chains across cameras—and automate preemptive alerts for urban threats like erratic driving, unauthorized access, or crowd anomalies. The TruTime feature sequences events along the transportation network with precise timing, enabling rapid incident investigation and root cause analysis.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <Camera className="h-8 w-8 mb-2" />
                  <div className="font-bold mb-1">Autonomous Video AI</div>
                  <div className="text-sm opacity-90">Real-time behavioral anomaly detection across 1,200 cameras</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <Clock className="h-8 w-8 mb-2" />
                  <div className="font-bold mb-1">TruTime Sequencing</div>
                  <div className="text-sm opacity-90">Temporal correlation of sensor readings and camera events</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <Navigation className="h-8 w-8 mb-2" />
                  <div className="font-bold mb-1">Graph Pathfinding</div>
                  <div className="text-sm opacity-90">Rapid pathfinding for traffic light optimization and rerouting</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-20 bg-white">
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
      <section className="py-20 bg-gradient-to-br from-green-50 to-teal-50">
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
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">87/100</div>
                  <div className="text-lg opacity-90">Citizen Satisfaction</div>
                  <div className="text-sm opacity-75">(up from 61/100)</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">92%</div>
                  <div className="text-lg opacity-90">Incident Detection Accuracy</div>
                  <div className="text-sm opacity-75">(AI-powered automation)</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">$8.5M</div>
                  <div className="text-lg opacity-90">Annual Economic Benefit</div>
                  <div className="text-sm opacity-75">(reduced congestion costs)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-white">
        <div className="container max-w-4xl">
          <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-primary/20">
            <CardContent className="p-12">
              <div className="text-6xl text-primary mb-6">"</div>
              <p className="text-2xl text-gray-800 leading-relaxed mb-8 italic">
                Tru-InSight's video AI agents have revolutionized our traffic operations. What used to take our analysts hours to investigate now happens automatically in minutes. The system detected an erratic driver last month and alerted police before a potential accident—that's the kind of proactive intelligence that saves lives. The ROI has been extraordinary.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Michael Rodriguez</div>
                  <div className="text-gray-600">Director of Transportation Operations</div>
                  <div className="text-gray-500">Smart City Transit Authority</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Transportation Network?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Discover how TruContext can deliver similar results for your intelligent transportation systems
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
