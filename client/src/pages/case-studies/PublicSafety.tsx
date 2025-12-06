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
    { label: "Cyber-Physical Threat Detection", before: "Manual review", after: "Could automate 24/7", improvement: "100% coverage" },
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
              Public Safety Use Case Scenario
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Metro Police Department: <span className="text-primary">Predictive Policing & Threat Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              How a major metropolitan police department could deploy TruContext to achieve 50% improvement in crime prevention, 78% reduction in false positives, and ethical transparency in predictive policing through graph analytics, cyber-physical threat correlation, and MITRE ATT&CK integration.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span><strong>Location:</strong> Major East Coast Metropolitan Area</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span><strong>Coverage:</strong> 3.2M residents, 12 precincts</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span><strong>Potential Deployment:</strong> Q1 2023 - Q3 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">The Opportunity</h2>
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
            <CardContent className="p-10">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The Metro Police Department served 3.2 million residents across 12 precincts but lacked the analytical tools to proactively identify intervention targets or understand criminal network relationships. Traditional systems couldn't correlate cyber threats with physical infrastructure vulnerabilities, leaving critical city operations exposed to cascading cyber-physical failures. With a 41% false positive rate, officers were overwhelmed with alerts while real threats went undetected.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Operational Challenges:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>No visibility into criminal network relationships</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Cyber threats disconnected from physical infrastructure</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>41% false positive rate overwhelming officers</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>No ethical transparency in predictive algorithms</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Business Impact:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Crime prevention rate: only 52%</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Community trust score: 58/100</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Reactive response to cyber-physical threats</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Concerns about algorithmic bias and accountability</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">The TruContext Approach</h2>
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
              <h3 className="text-2xl font-bold mb-4">Graph Analytics for Predictive Policing</h3>
              <p className="text-lg opacity-90 leading-relaxed mb-6">
                TruContext's graph database architecture is uniquely could position for predictive policing applications. Co-offending Network Analysis links individuals who have committed crimes together, while Link Prediction identifies emerging criminal network relationships. The platform fuses historical crime data with infrastructure data—such as mapping crime hot spots against broken windows or graffiti—to prioritize high-risk areas for intervention. Unlike "black box" AI algorithms, TruContext's knowledge graph provides structurally visible, traceable relationships with full audit trails, fulfilling the ethical mandate for clarity in data-driven governance.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <Network className="h-8 w-8 mb-2" />
                  <div className="font-bold mb-1">Co-Offending Analysis</div>
                  <div className="text-sm opacity-90">Graph analytics reveal criminal network relationships</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <AlertTriangle className="h-8 w-8 mb-2" />
                  <div className="font-bold mb-1">Cyber-Physical Threats</div>
                  <div className="text-sm opacity-90">CVE/CVSS correlation with physical infrastructure</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <Eye className="h-8 w-8 mb-2" />
                  <div className="font-bold mb-1">Ethical Transparency</div>
                  <div className="text-sm opacity-90">Audit trails and explainable AI for accountability</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Potential Implementation Timeline */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Potential Implementation Timeline</h2>
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
                  <div className="text-5xl font-bold mb-2"><CountUp end={82} />/100</div>
                  <div className="text-lg opacity-90">Community Trust Score</div>
                  <div className="text-sm opacity-75">(up from 58/100)</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2"><CountUp end={94} suffix="%" /></div>
                  <div className="text-lg opacity-90">Threat Detection Accuracy</div>
                  <div className="text-sm opacity-75">(cyber-physical correlation)</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">Zero</div>
                  <div className="text-lg opacity-90">Cascading Failures</div>
                  <div className="text-sm opacity-75">(prevented in 18 months)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ethical Transparency Section */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Ethical Transparency & Accountability</h2>
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-primary/20">
            <CardContent className="p-10">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                In the ethically sensitive area of predictive policing, TruContext provides a critical advantage: architectural transparency. Analysis derived from a knowledge graph, unlike some proprietary "black box" AI algorithms, is based on structurally visible, traceable relationships. The graph explicitly maps the nodes (e.g., individuals or locations) and the edges (relationships or past crimes) used in the analysis.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Transparency Features:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Full audit trails with geolocation and timestamps</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Code Editor/Cypher query language for data structure examination</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Explainable AI vs. "black box" algorithms</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Approval trails for all decisions impacting operations</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Accountability Measures:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Regular ethical compliance audits</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Community oversight board access to analysis methodology</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Bias detection and mitigation protocols</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Public reporting on prediction accuracy and fairness metrics</span>
                    </li>
                  </ul>
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
            Ready to Transform Your Public Safety Operations?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Discover how TruContext can deliver similar results for your law enforcement and security operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Schedule Consultation
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Download className="h-5 w-5 mr-2" />
              Download Use Case Scenario PDF
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
