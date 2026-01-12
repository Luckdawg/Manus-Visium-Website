import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, AlertCircle, TrendingUp, Lock, CheckCircle2, Building2 } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import CountUp from "@/components/CountUp";

export default function GovernmentFederal() {
  return (
    <>
      <SEOHead
        title="Government Cybersecurity Platform | FedRAMP | DoD Threat Detection | NIST Compliance"
        description="Protect government agencies with TruContext's FedRAMP-authorized cybersecurity platform. Real-time threat detection for federal agencies, DoD, DHS, and critical infrastructure with NIST framework compliance."
        keywords="government cybersecurity, FedRAMP compliance, DoD cybersecurity, federal threat detection, NIST framework, critical infrastructure security, government security platform, defense cybersecurity"
        canonicalUrl="/solutions/government-federal"
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Government Cybersecurity Platform with <span className="text-primary">FedRAMP & DoD Heritage</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Protect federal agencies, DoD, DHS, and critical infrastructure with TruContext's government-grade cybersecurity platform. Real-time threat detection with FedRAMP authorization, NIST framework compliance, and proven DoD heritage from MITRE CyGraph. Secure government networks and detect advanced persistent threats targeting federal systems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Schedule a Demo
                  </Button>
                </Link>
                <Link href="/company/contact">
                  <Button size="lg" variant="outline">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* DoD Heritage Section */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Proven DoD Heritage & Military-Grade Security
            </h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
              TruContext is based on MITRE Corporation's CyGraph platform, originally developed for the U.S. Army Cyber Command. This proven military heritage ensures TruContext meets the highest government security standards and has been battle-tested in defense operations.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-t-4 border-t-primary">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">MITRE Heritage</h3>
                  <p className="text-gray-600">
                    Enhanced version of MITRE's CyGraph platform, originally developed for U.S. Army Cyber Command. Proven in defense operations and trusted by government agencies.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-secondary">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Government Vetted</h3>
                  <p className="text-gray-600">
                    Designed specifically for government use cases including DoD, DHS, NSA, and federal agencies. Meets stringent government security and compliance requirements.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-primary">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Defense-Grade Technology</h3>
                  <p className="text-gray-600">
                    Patented scalable multi-layered graph database technology processes billions of events in real-time. Proven to detect advanced persistent threats and sophisticated attacks.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* The Challenge */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Government Cybersecurity Challenges
            </h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
              Federal agencies face sophisticated threats from nation-state actors, terrorist organizations, and criminal groups. Advanced persistent threats (APTs) target critical infrastructure, defense systems, and government networks. Legacy security tools struggle to detect advanced threats while maintaining compliance with NIST, FedRAMP, and DoD security requirements.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">APT Threats</h3>
                      <p className="text-gray-600">Advanced persistent threats from nation-states and organized groups</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Critical Infrastructure</h3>
                      <p className="text-gray-600">Threats targeting power grids, water systems, and government networks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Lock className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Compliance Complexity</h3>
                      <p className="text-gray-600">NIST, FedRAMP, DoD, and FISMA requirements create implementation burden</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Government-Grade Threat Detection & Defense
            </h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
              TruContext is a government cybersecurity platform delivering real-time threat detection for federal agencies, DoD, DHS, and critical infrastructure. Our government security platform detects advanced persistent threats, insider threats, and supply chain attacks while maintaining FedRAMP authorization and NIST framework compliance.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">APT Detection & Defense</h3>
                  </div>
                  <p className="text-gray-600">
                    Detect advanced persistent threats from nation-states and organized groups. Identify multi-stage attacks, lateral movement, and command-and-control communications. Correlate threat intelligence with network activity to expose hidden attack campaigns.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <Building2 className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Critical Infrastructure Protection</h3>
                  </div>
                  <p className="text-gray-600">
                    Protect power grids, water systems, transportation networks, and government infrastructure. Monitor SCADA/ICS systems for anomalies. Detect threats targeting industrial control systems and critical operations.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Supply Chain Security</h3>
                  </div>
                  <p className="text-gray-600">
                    Detect supply chain attacks and compromised software/hardware. Monitor vendor access and third-party integrations. Identify threats entering government networks through supply chain compromise.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Compliance & Certification</h3>
                  </div>
                  <p className="text-gray-600">
                    FedRAMP-authorized platform with NIST framework compliance. Automated compliance monitoring for FISMA, DoD RMF, and government security requirements. Audit-ready documentation and continuous monitoring.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Key Government Security Capabilities</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Threat Intelligence Integration</p>
                    <p className="text-sm text-gray-600">Integrate with CISA alerts, NSA advisories, and government threat feeds</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Network Segmentation</p>
                    <p className="text-sm text-gray-600">Enforce classified/unclassified separation and network isolation</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Insider Threat Detection</p>
                    <p className="text-sm text-gray-600">Monitor privileged access and detect unauthorized data access</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Incident Response</p>
                    <p className="text-sm text-gray-600">Automated threat hunting and incident response workflows</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Government Use Cases */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Government Use Cases
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">DoD & Military</h3>
                  <p className="text-gray-600 mb-4">
                    Protect military networks, weapons systems, and defense operations from advanced persistent threats. Detect APTs targeting classified systems and military infrastructure.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ DoD RMF compliance</li>
                    <li>✓ CISO/DISA requirements</li>
                    <li>✓ Weapons system protection</li>
                    <li>✓ Military network defense</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">DHS & Critical Infrastructure</h3>
                  <p className="text-gray-600 mb-4">
                    Protect critical infrastructure including power grids, water systems, and transportation networks. Meet CISA requirements and detect threats to essential services.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ CISA guidelines compliance</li>
                    <li>✓ Power grid security</li>
                    <li>✓ Water system protection</li>
                    <li>✓ Transportation security</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Federal Agencies</h3>
                  <p className="text-gray-600 mb-4">
                    Protect federal government networks, citizen data, and government systems. Maintain FISMA compliance and detect threats to government operations.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ FISMA compliance</li>
                    <li>✓ FedRAMP authorization</li>
                    <li>✓ NIST framework</li>
                    <li>✓ Government network defense</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Intelligence Community</h3>
                  <p className="text-gray-600 mb-4">
                    Support intelligence operations and counterintelligence activities. Detect foreign intelligence operations and protect classified information systems.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Classified system support</li>
                    <li>✓ Counterintelligence</li>
                    <li>✓ Foreign threat detection</li>
                    <li>✓ Information protection</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Proven ROI */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Proven Government Security ROI
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    <CountUp end={85} suffix="%" />
                  </div>
                  <p className="text-gray-600 font-semibold">Threat Detection Improvement</p>
                  <p className="text-sm text-gray-500 mt-2">Detect APTs and advanced threats</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">
                    <CountUp end={75} suffix="%" />
                  </div>
                  <p className="text-gray-600 font-semibold">Faster Response Time</p>
                  <p className="text-sm text-gray-500 mt-2">Reduce dwell time and impact</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    <CountUp end={100} suffix="%" />
                  </div>
                  <p className="text-gray-600 font-semibold">FedRAMP Compliant</p>
                  <p className="text-sm text-gray-500 mt-2">Government-authorized platform</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Government Security Metrics</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-2"><strong>Mission Assurance:</strong> Ensure continuity of government operations and critical services</p>
                  <p className="text-gray-700 mb-2"><strong>Compliance Certification:</strong> FedRAMP-authorized, NIST-compliant, DoD RMF-ready platform</p>
                </div>
                <div>
                  <p className="text-gray-700 mb-2"><strong>Threat Prevention:</strong> Detect and stop APTs, insider threats, and supply chain attacks</p>
                  <p className="text-gray-700 mb-2"><strong>Information Protection:</strong> Safeguard classified information and sensitive government data</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Government Compliance & Certifications
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">FedRAMP & NIST</h3>
                  <p className="text-gray-600 mb-4">
                    FedRAMP-authorized platform meeting NIST Cybersecurity Framework requirements. Compliant with NIST SP 800-53 security controls and continuous monitoring requirements.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ FedRAMP authorization</li>
                    <li>✓ NIST framework compliance</li>
                    <li>✓ NIST SP 800-53 controls</li>
                    <li>✓ Continuous monitoring</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">DoD & Government Standards</h3>
                  <p className="text-gray-600 mb-4">
                    DoD RMF-ready platform supporting FISMA, DISA requirements, and government security standards.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ DoD RMF compliance</li>
                    <li>✓ FISMA requirements</li>
                    <li>✓ DISA security standards</li>
                    <li>✓ Government contracting ready</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 md:py-12 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Protect Government Operations with FedRAMP-Authorized Cybersecurity
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              See how TruContext helps federal agencies, DoD, and critical infrastructure detect advanced threats and maintain compliance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Schedule a Demo
                </Button>
              </Link>
              <Link href="/company/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
