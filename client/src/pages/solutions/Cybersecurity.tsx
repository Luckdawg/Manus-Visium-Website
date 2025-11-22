import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, AlertTriangle, Network, TrendingDown, Clock, CheckCircle2 } from "lucide-react";

export default function Cybersecurity() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Cybersecurity & <span className="text-primary">Threat Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your security operations with agentic AI-powered threat detection, dual database architecture (Neo4j + PostgreSQL), and autonomous response capabilities
            </p>
            <Link href="/demo">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">The Challenge</h2>
            <p className="text-xl text-gray-600">
              Security teams are overwhelmed by alert fatigue, struggling to correlate threats across disparate tools, and spending days investigating incidents that should take minutes. Traditional SIEM platforms show you what happened, but lack the context to understand why it matters or what's likely to happen next.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
                <h3 className="text-lg font-bold mb-2">Alert Fatigue</h3>
                <p className="text-gray-600">Thousands of false positives drowning out real threats</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <Clock className="h-10 w-10 text-orange-500 mb-4" />
                <h3 className="text-lg font-bold mb-2">Slow Detection</h3>
                <p className="text-gray-600">Days or weeks to detect sophisticated attacks</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <Network className="h-10 w-10 text-yellow-500 mb-4" />
                <h3 className="text-lg font-bold mb-2">Siloed Data</h3>
                <p className="text-gray-600">Disconnected security tools with no unified view</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-12 gradient-purple-blue">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">The TruContext Solution</h2>
            <p className="text-xl text-gray-600">
              TruContext's agentic AI agents autonomously correlate security data from SIEM, EDR, firewalls, and other feeds using our dual database architecture to visualize and predict attack chains in real-time, utilizing the MITRE ATT&CK framework for threat-informed defense.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Agentic AI Threat Correlation
                </h3>
                <p className="text-gray-700">
                  Autonomous AI agents correlate threat indicators across all security tools using Neo4j graph database, linking disparate events to expose complete attack chains. Reduce investigation time from days to seconds with agentic AI-powered analysis and PostgreSQL-backed persistence.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Network className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  AI-Powered MITRE ATT&CK Mapping
                </h3>
                <p className="text-gray-700">
                  Agentic AI automatically maps detected threats to MITRE ATT&CK tactics, techniques, and procedures (TTPs) for threat-informed defense. Autonomous agents understand adversary behavior and prioritize response based on attack progression without human intervention.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <TrendingDown className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Predictive Threat Intelligence
                </h3>
                <p className="text-gray-700">
                  Move from reactive to proactive security with AI that predicts likely attack paths and surfaces threats before they materialize. Focus on prevention, not just detection.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <AlertTriangle className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Intelligent Alert Filtering
                </h3>
                <p className="text-gray-700">
                  Reduce false positives by 90% with context-aware alerting that understands normal behavior and only surfaces genuine threats requiring investigation.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Applications</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Multi-Source Data Correlation</h4>
                  <p className="text-gray-600">Integrate SIEM, EDR, firewalls, IDS/IPS, and threat intelligence feeds</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Attack Chain Visualization</h4>
                  <p className="text-gray-600">See the complete attack progression from initial access to exfiltration</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Insider Threat Detection</h4>
                  <p className="text-gray-600">Identify anomalous user behavior and privilege escalation attempts</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Threat Hunting</h4>
                  <p className="text-gray-600">Proactively search for hidden threats using graph-based queries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Metrics */}
      <section className="py-12 bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Proven ROI & Metrics</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center border-t-4 border-t-primary">
              <CardContent className="p-8">
                <div className="text-6xl font-bold text-primary mb-2">75%</div>
                <p className="text-xl font-semibold text-gray-900 mb-2">Reduction in MTTD</p>
                <p className="text-gray-600">Mean Time to Detect threats cut by three-quarters</p>
              </CardContent>
            </Card>

            <Card className="text-center border-t-4 border-t-secondary">
              <CardContent className="p-8">
                <div className="text-6xl font-bold text-secondary mb-2">60%</div>
                <p className="text-xl font-semibold text-gray-900 mb-2">Faster Incident Response</p>
                <p className="text-gray-600">Reduce investigation and response time by more than half</p>
              </CardContent>
            </Card>

            <Card className="text-center border-t-4 border-t-primary">
              <CardContent className="p-8">
                <div className="text-6xl font-bold text-primary mb-2">90%</div>
                <p className="text-xl font-semibold text-gray-900 mb-2">Reduction in False Positives</p>
                <p className="text-gray-600">Eliminate alert fatigue and focus on real threats</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-primary">
            <CardContent className="p-8 text-center">
              <Clock className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                30 Days to Actionable Insights
              </h3>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Most customers see measurable improvements in threat detection and response within the first month of deployment, with full ROI typically achieved within 6 months.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Customer Story */}
      <section className="py-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Customer Success Story</h2>
            <blockquote className="text-xl italic mb-6">
              "TruContext transformed our security operations. We went from drowning in alerts to having clear, actionable intelligence. The MITRE ATT&CK integration gives us the context we need to prioritize threats and respond effectively."
            </blockquote>
            <div className="text-lg">
              <p className="font-semibold">Apex Petroleum Corporation</p>
              <p className="text-gray-300">Multi-year Cybersecurity Contract</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Security Operations?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            See how TruContext can reduce your MTTD by 75% and eliminate alert fatigue
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Schedule a Demo
              </Button>
            </Link>
            <Link href="/why/roi">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Calculate Your ROI
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
