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
import CountUp from "@/components/CountUp";

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
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-blue-500/10 text-blue-700 border-blue-500/20">
              <Car className="h-4 w-4 mr-2" />
              Intelligent Transportation Use Case
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Smart City Transit Authority: <span className="text-primary">Adaptive Traffic Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Explore how a major metropolitan transit authority could deploy TruContext with Tru-InSight video AI to potentially achieve 61% faster incident clearance, 55% congestion reduction, and $2.1M in annual infrastructure maintenance savings through spatio-temporal analytics and autonomous traffic management.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span><strong>Scenario:</strong> Major West Coast Metropolitan Area</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span><strong>Potential Coverage:</strong> 1.8M residents, 180-mile network</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span><strong>Estimated Timeline:</strong> 32-week deployment</span>
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
                Smart city transit authorities often manage complex transportation networks serving millions of residents, but legacy systems typically cannot correlate data from thousands of traffic cameras, sensors, and mobile GPS reports. Traffic incidents can take 30+ minutes to clear, and reactive maintenance often costs millions annually while infrastructure continues to deteriorate.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Common Operational Challenges:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Manual video review consuming dozens of analyst hours daily</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Siloed data preventing holistic traffic pattern understanding</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Reactive incident response increasing congestion duration</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Infrastructure failures discovered only after breakdowns occur</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Potential Business Impact:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Millions in annual costs from traffic congestion</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Declining public satisfaction with transit services</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Emergency response delays affecting public safety</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Escalating maintenance costs from reactive repairs</span>
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
          <h2 className="text-4xl font-bold text-gray-900 mb-8">How TruContext Could Transform Traffic Management</h2>
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
              <h3 className="text-2xl font-bold mb-4">Tru-InSight Video AI Integration</h3>
              <p className="text-lg opacity-90 leading-relaxed mb-6">
                TruContext's Tru-InSight video AI agents would continuously analyze traffic camera feeds to detect incidents, identify congestion patterns, and recognize behavioral anomalies in real-time. The graph-based architecture would correlate video insights with sensor data, weather conditions, and historical patterns to enable predictive traffic management and autonomous incident response.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <Camera className="h-8 w-8 mb-2" />
                  <div className="font-bold mb-1">Video Analytics</div>
                  <div className="text-sm opacity-90">AI agents analyze 1,200+ camera feeds for incident detection</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <Navigation className="h-8 w-8 mb-2" />
                  <div className="font-bold mb-1">Spatio-Temporal Correlation</div>
                  <div className="text-sm opacity-90">TruTime sequences events across the transportation network</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <Car className="h-8 w-8 mb-2" />
                  <div className="font-bold mb-1">Autonomous Response</div>
                  <div className="text-sm opacity-90">Automated traffic light adjustments and rerouting</div>
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
                    <CountUp end={61} duration={2} />%
                  </div>
                  <div className="text-gray-700">Faster incident clearance through AI-powered detection</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    <CountUp end={55} duration={2} />%
                  </div>
                  <div className="text-gray-700">Reduction in peak-hour traffic congestion</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    $<CountUp end={2.1} decimals={1} duration={2} />M
                  </div>
                  <div className="text-gray-700">Estimated annual infrastructure maintenance savings</div>
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
                <Camera className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Intelligent Video Analysis</h3>
                <p className="text-gray-700 leading-relaxed">
                  Tru-InSight AI agents would continuously monitor traffic camera feeds, automatically detecting incidents, identifying congestion patterns, and recognizing behavioral anomalies—eliminating the need for manual video review.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Navigation className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Predictive Congestion Modeling</h3>
                <p className="text-gray-700 leading-relaxed">
                  The graph-based architecture would model the entire transportation network, enabling machine learning algorithms to predict congestion before it occurs and recommend proactive traffic light adjustments.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Car className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Autonomous Incident Response</h3>
                <p className="text-gray-700 leading-relaxed">
                  When incidents are detected, Tru-AI agents could automatically dispatch field services, adjust traffic signals to reroute vehicles, and notify emergency responders—reducing clearance time from hours to minutes.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Clock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Predictive Maintenance</h3>
                <p className="text-gray-700 leading-relaxed">
                  TruTime's temporal correlation would identify infrastructure degradation patterns before failures occur, enabling proactive maintenance that could reduce costs by 50% compared to reactive repairs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Transportation Network?</h2>
          <p className="text-xl opacity-90 mb-8 leading-relaxed">
            Discover how TruContext could help your transit authority achieve similar outcomes through intelligent video analytics, predictive congestion modeling, and autonomous incident response.
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
