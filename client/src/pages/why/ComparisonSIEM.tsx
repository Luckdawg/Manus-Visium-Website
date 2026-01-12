import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { CheckCircle2, X, TrendingUp, Zap, Database, AlertCircle } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

export default function ComparisonSIEM() {
  return (
    <>
      <SEOHead
        title="TruContext vs Traditional SIEM | Graph-Based Threat Detection Comparison"
        description="Compare TruContext's graph-based threat detection platform with traditional SIEM solutions. Learn why graph databases outperform legacy SIEM for threat correlation and detection."
        keywords="TruContext vs SIEM, graph-based threat detection, SIEM comparison, legacy threat detection, graph database security, threat correlation, advanced threat detection, SIEM alternative"
        canonicalUrl="/why/comparison-siem"
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                TruContext vs Traditional SIEM: <span className="text-primary">Graph-Based Threat Detection</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Traditional SIEM platforms struggle with threat correlation and detection speed. TruContext's graph-based threat detection platform processes billions of events in real-time, correlating relationships across your entire security landscape to detect threats that legacy SIEM solutions miss.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    See the Difference
                  </Button>
                </Link>
                <Link href="/company/contact">
                  <Button size="lg" variant="outline">
                    Talk to an Expert
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem with Traditional SIEM */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              The Limitations of Legacy SIEM Solutions
            </h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
              Traditional SIEM platforms were designed for log aggregation and basic correlation. They struggle with modern threat complexity, generating thousands of false positives while missing sophisticated attacks that require deep relationship analysis across your entire environment.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">Alert Fatigue</h3>
                  <p className="text-gray-600 text-sm">
                    Traditional SIEM generates thousands of false positives, overwhelming security teams and causing alert fatigue. Analysts spend 80% of time investigating false alerts instead of real threats.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">Slow Threat Detection</h3>
                  <p className="text-gray-600 text-sm">
                    Legacy SIEM correlation rules are slow and rigid. Complex threat patterns require manual rule creation. Dwell time averages 200+ days as threats go undetected.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">Limited Correlation</h3>
                  <p className="text-gray-600 text-sm">
                    SIEM tools can only correlate data they ingest. They miss relationships across disconnected systems and fail to detect sophisticated multi-stage attacks.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Feature Comparison: TruContext vs Traditional SIEM
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Feature</th>
                    <th className="text-center py-4 px-4 font-bold text-primary">TruContext</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-600">Traditional SIEM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 bg-white">
                    <td className="py-4 px-4 font-semibold text-gray-900">Threat Correlation</td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <AlertCircle className="h-6 w-6 text-orange-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-white">
                    <td className="py-4 px-4 font-semibold text-gray-900">Graph-Based Analysis</td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-6 w-6 text-red-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-white">
                    <td className="py-4 px-4 font-semibold text-gray-900">Real-Time Processing</td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <AlertCircle className="h-6 w-6 text-orange-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-white">
                    <td className="py-4 px-4 font-semibold text-gray-900">AI-Powered Detection</td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <AlertCircle className="h-6 w-6 text-orange-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-white">
                    <td className="py-4 px-4 font-semibold text-gray-900">Behavioral Analytics</td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <AlertCircle className="h-6 w-6 text-orange-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-white">
                    <td className="py-4 px-4 font-semibold text-gray-900">Insider Threat Detection</td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <AlertCircle className="h-6 w-6 text-orange-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-white">
                    <td className="py-4 px-4 font-semibold text-gray-900">Threat Hunting</td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <AlertCircle className="h-6 w-6 text-orange-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-white">
                    <td className="py-4 px-4 font-semibold text-gray-900">Scalability (QPS)</td>
                    <td className="py-4 px-4 text-center text-primary font-bold">
                      20 QPS
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600">
                      5 QPS
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-white">
                    <td className="py-4 px-4 font-semibold text-gray-900">False Positive Reduction</td>
                    <td className="py-4 px-4 text-center text-primary font-bold">
                      90%
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600">
                      20-30%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Performance Comparison */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Performance & Detection Capabilities
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-primary mb-6">TruContext</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">20 Queries Per Second (QPS)</p>
                        <p className="text-sm text-gray-600">Process billions of events in real-time</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">90% False Positive Reduction</p>
                        <p className="text-sm text-gray-600">Focus on real threats, not noise</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Graph-Based Correlation</p>
                        <p className="text-sm text-gray-600">Detect relationships across entire environment</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">75% Faster Detection (MTTD)</p>
                        <p className="text-sm text-gray-600">Reduce dwell time and threat impact</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">AI-Powered Threat Hunting</p>
                        <p className="text-sm text-gray-600">Automated detection of advanced threats</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Behavioral Analytics</p>
                        <p className="text-sm text-gray-600">Detect insider threats and anomalies</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-300">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-600 mb-6">Traditional SIEM</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">5 Queries Per Second (QPS)</p>
                        <p className="text-sm text-gray-600">Limited scalability for large environments</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">20-30% False Positive Reduction</p>
                        <p className="text-sm text-gray-600">Alert fatigue and analyst burnout</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Rule-Based Correlation</p>
                        <p className="text-sm text-gray-600">Manual rule creation and maintenance</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">200+ Day Average Dwell Time</p>
                        <p className="text-sm text-gray-600">Threats go undetected for months</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Limited AI Capabilities</p>
                        <p className="text-sm text-gray-600">Basic anomaly detection only</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Limited Behavioral Analysis</p>
                        <p className="text-sm text-gray-600">Insider threats often missed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Graph-Based Detection */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Why Graph-Based Threat Detection Outperforms Legacy SIEM
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <Database className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Relationship Analysis</h3>
                  </div>
                  <p className="text-gray-600">
                    Graph databases excel at analyzing relationships between entities. TruContext correlates users, assets, behaviors, and threats across your entire environment to detect sophisticated attacks that traditional SIEM misses.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <Zap className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Real-Time Performance</h3>
                  </div>
                  <p className="text-gray-600">
                    Graph databases process queries 4x faster than traditional databases. TruContext analyzes billions of events in real-time, enabling immediate threat detection and response.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Scalability</h3>
                  </div>
                  <p className="text-gray-600">
                    TruContext scales to billions of events without performance degradation. Traditional SIEM solutions slow down as data volume increases, limiting their effectiveness in large environments.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <AlertCircle className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Intelligent Correlation</h3>
                  </div>
                  <p className="text-gray-600">
                    AI-powered correlation automatically discovers threat patterns without manual rule creation. TruContext learns from your environment and adapts to new attack techniques.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Use Case Comparison */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Real-World Detection Scenarios
            </h2>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Scenario: Multi-Stage APT Attack</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-semibold text-primary mb-2">TruContext Detection</p>
                      <p className="text-gray-600 text-sm">
                        Correlates initial compromise, lateral movement, privilege escalation, and data exfiltration across the attack chain. Detects the attack within hours and identifies all compromised systems.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-2">Traditional SIEM</p>
                      <p className="text-gray-600 text-sm">
                        Generates alerts for individual events but fails to correlate them into a coherent attack pattern. Security team may miss the attack entirely or detect it only after data exfiltration.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Scenario: Insider Threat</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-semibold text-primary mb-2">TruContext Detection</p>
                      <p className="text-gray-600 text-sm">
                        Behavioral analytics identify unusual access patterns, data downloads, and privilege abuse. Detects the threat within days and provides evidence of unauthorized activity.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-2">Traditional SIEM</p>
                      <p className="text-gray-600 text-sm">
                        Limited behavioral analysis misses subtle indicators of insider threats. Insider may exfiltrate data without triggering alerts, discovered only through external breach notification.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Scenario: Ransomware Attack</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-semibold text-primary mb-2">TruContext Detection</p>
                      <p className="text-gray-600 text-sm">
                        Detects reconnaissance, lateral movement, and encryption patterns before widespread encryption. Enables rapid response to stop the attack and prevent data loss.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-2">Traditional SIEM</p>
                      <p className="text-gray-600 text-sm">
                        Detects encryption activity only after it has already spread across multiple systems. By the time alerts are generated, significant damage has occurred.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Cost Comparison */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Total Cost of Ownership Comparison
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Traditional SIEM</h3>
                  <div className="space-y-3 text-gray-600 text-sm">
                    <p><strong>Software License:</strong> $500K-$2M annually</p>
                    <p><strong>Implementation:</strong> $200K-$500K</p>
                    <p><strong>Ongoing Maintenance:</strong> $100K-$300K annually</p>
                    <p><strong>Rule Development:</strong> $50K-$200K annually</p>
                    <p><strong>Staff (SIEM Analysts):</strong> 3-5 FTE @ $150K-$200K each</p>
                    <p className="border-t pt-3 font-semibold text-gray-900"><strong>5-Year TCO:</strong> $3.5M-$7M</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-primary mb-4">TruContext</h3>
                  <div className="space-y-3 text-gray-600 text-sm">
                    <p><strong>Platform License:</strong> $300K-$800K annually</p>
                    <p><strong>Implementation:</strong> $100K-$250K</p>
                    <p><strong>Ongoing Support:</strong> $50K-$150K annually</p>
                    <p><strong>Rule Development:</strong> Minimal (AI-powered)</p>
                    <p><strong>Staff (Reduced):</strong> 1-2 FTE @ $150K-$200K each</p>
                    <p className="border-t pt-3 font-semibold text-primary"><strong>5-Year TCO:</strong> $1.5M-$3.5M</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 bg-white rounded-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Additional Cost Savings with TruContext</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="font-semibold text-primary mb-2">Reduced Incident Response</p>
                  <p className="text-gray-600 text-sm">Faster threat detection reduces incident response costs by 40-60%</p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-2">Fewer False Positives</p>
                  <p className="text-gray-600 text-sm">90% false positive reduction saves 200+ analyst hours annually</p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-2">Breach Prevention</p>
                  <p className="text-gray-600 text-sm">Early threat detection prevents breaches costing $4.45M+ on average</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 md:py-12 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Ready to Move Beyond Traditional SIEM?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              See how TruContext's graph-based threat detection outperforms legacy SIEM solutions with faster detection, fewer false positives, and lower total cost of ownership
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Schedule a Demo
                </Button>
              </Link>
              <Link href="/company/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
