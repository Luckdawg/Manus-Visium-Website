import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Shield, 
  CheckCircle2, 
  TrendingDown, 
  Clock, 
  AlertTriangle,
  Network,
  ArrowRight,
  Download,
  Calendar,
  MapPin,
  Users,
  Eye
} from "lucide-react";
import CountUp from "@/components/CountUp";

export default function PublicSafetyCaseStudy() {
  const metrics = [
    { label: "Crime Prevention Rate", before: "52%", after: "78%", improvement: "+50% effectiveness" },
    { label: "Cyber-Physical Threat Detection", before: "Manual review", after: "Automated 24/7", improvement: "100% coverage" },
    { label: "Incident Response Time", before: "12.5 minutes", after: "6.8 minutes", improvement: "46% faster" },
    { label: "False Positive Rate", before: "41%", after: "9%", improvement: "78% reduction" }
  ];

  const timeline = [
    { phase: "Security Assessment", duration: "5 weeks", activities: ["Threat landscape analysis", "Infrastructure vulnerability audit", "Historical crime data review", "Stakeholder requirements"] },
    { phase: "Pilot District", duration: "12 weeks", activities: ["Deploy in high-risk district", "Integrate crime databases", "Connect surveillance network", "Train predictive models"] },
    { phase: "City-Wide Deployment", duration: "18 weeks", activities: ["Expand to all precincts", "MITRE ATT&CK integration", "CVE/CVSS risk mapping", "Officer training program"] },
    { phase: "Advanced Analytics", duration: "Ongoing", activities: ["Co-offending network analysis", "Link prediction refinement", "Ethical transparency audits", "Continuous model improvement"] }
  ];

  const technicalComponents = [
    {
      component: "Data Sources",
      items: ["Historical crime data", "Public infrastructure violations", "Network external entry logs", "MITRE vulnerability databases", "Surveillance camera feeds", "911 dispatch records"]
    },
    {
      component: "TruContext Integration",
      items: ["Graph analytics (co-offending networks)", "CVE/CVSS risk grouping", "Subnet isolation & filtering", "Link prediction algorithms", "External entry identification", "Audit trail transparency"]
    },
    {
      component: "Key Capabilities",
      items: ["Predictive policing analytics", "Cyber-physical threat correlation", "Ethical AI with explainability", "Real-time threat isolation", "Network breach detection", "Cascading failure mitigation"]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-purple-500/10 text-purple-700 border-purple-500/20">
              <Shield className="h-4 w-4 mr-2" />
              Public Safety Use Case
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Metro Police Department: <span className="text-primary">Predictive Policing & Threat Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Explore how a major metropolitan police department could deploy TruContext to potentially achieve 50% improvement in crime prevention, 78% reduction in false positives, and ethical transparency in predictive policing through graph analytics, cyber-physical threat correlation, and MITRE ATT&CK integration.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span><strong>Scenario:</strong> Major East Coast Metropolitan Area</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span><strong>Potential Coverage:</strong> 3.2M residents, 12 precincts</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span><strong>Estimated Timeline:</strong> 35-week deployment</span>
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
                Metropolitan police departments often serve millions of residents across multiple precincts but may lack the analytical tools to proactively identify intervention targets or understand criminal network relationships. Traditional systems typically cannot correlate cyber threats with physical infrastructure vulnerabilities, potentially leaving critical city operations exposed to cascading cyber-physical failures. High false positive rates can overwhelm officers with alerts while real threats go undetected.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Common Operational Challenges:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Limited visibility into criminal network relationships</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Disconnected cyber and physical threat intelligence systems</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Reactive policing with limited predictive capabilities</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>High false positive rates overwhelming investigative resources</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Potential Impact:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Declining public safety and community trust</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Missed opportunities for crime prevention</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Critical infrastructure vulnerable to cyber-physical attacks</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Resource inefficiency from investigating false leads</span>
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
          <h2 className="text-4xl font-bold text-gray-900 mb-8">How TruContext Could Transform Public Safety</h2>
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
              <h3 className="text-2xl font-bold mb-4">Ethical Predictive Policing with Transparency</h3>
              <p className="text-lg opacity-90 leading-relaxed mb-6">
                TruContext's graph analytics would enable ethical predictive policing by modeling co-offending networks, identifying intervention targets, and providing full audit trail transparency. The system would correlate cyber threats (CVE/CVSS vulnerabilities) with physical infrastructure to detect cascading failure risks before they materialize, while maintaining explainability and accountability in all AI-driven recommendations.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <Network className="h-8 w-8 mb-2" />
                  <div className="font-bold mb-1">Network Analysis</div>
                  <div className="text-sm opacity-90">Graph analytics reveal co-offending patterns and criminal networks</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <Shield className="h-8 w-8 mb-2" />
                  <div className="font-bold mb-1">Cyber-Physical Correlation</div>
                  <div className="text-sm opacity-90">MITRE ATT&CK integration maps threats to infrastructure</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <Eye className="h-8 w-8 mb-2" />
                  <div className="font-bold mb-1">Ethical Transparency</div>
                  <div className="text-sm opacity-90">Full audit trails ensure accountability and explainability</div>
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
                    <CountUp end={50} duration={2} />%
                  </div>
                  <div className="text-gray-700">Improvement in crime prevention effectiveness</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    <CountUp end={78} duration={2} />%
                  </div>
                  <div className="text-gray-700">Reduction in false positive alerts</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    <CountUp end={46} duration={2} />%
                  </div>
                  <div className="text-gray-700">Faster incident response time</div>
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
                <Network className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Criminal Network Analysis</h3>
                <p className="text-gray-700 leading-relaxed">
                  Graph analytics would model co-offending relationships and predict future criminal associations through link prediction algorithms, enabling proactive intervention while maintaining full audit trail transparency for ethical accountability.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Cyber-Physical Threat Detection</h3>
                <p className="text-gray-700 leading-relaxed">
                  MITRE ATT&CK integration would correlate CVE/CVSS vulnerabilities with physical infrastructure, identifying cascading failure risks before they materialize and enabling real-time threat isolation to protect critical city operations.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <AlertTriangle className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Intelligent Alert Filtering</h3>
                <p className="text-gray-700 leading-relaxed">
                  Machine learning models would dramatically reduce false positives by correlating multiple data sources and historical patterns, allowing officers to focus investigative resources on genuine threats rather than chasing false leads.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Eye className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Ethical AI with Explainability</h3>
                <p className="text-gray-700 leading-relaxed">
                  Every AI-driven recommendation would include full audit trails and explainability, ensuring transparency, accountability, and compliance with ethical policing standards while maintaining community trust.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Public Safety Operations?</h2>
          <p className="text-xl opacity-90 mb-8 leading-relaxed">
            Discover how TruContext could help your department achieve similar outcomes through ethical predictive policing, cyber-physical threat correlation, and transparent AI-driven analytics.
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
