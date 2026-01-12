import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, AlertCircle, TrendingUp, Lock, CheckCircle2, Radio } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import CountUp from "@/components/CountUp";

export default function TelecomCybersecurity() {
  return (
    <>
      <SEOHead
        title="Telecommunications Network Security | 5G Cybersecurity | Network Threat Detection"
        description="Protect telecom networks with TruContext's network security platform. Real-time threat detection for 5G, network infrastructure, and subscriber data with carrier-grade compliance."
        keywords="telecommunications cybersecurity, network security platform, 5G security, telecom threat detection, network infrastructure security, subscriber data protection, carrier security, telecom compliance"
        canonicalUrl="/solutions/telecom-cybersecurity"
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Telecommunications Network Security for <span className="text-primary">5G & Beyond</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Protect telecom networks, 5G infrastructure, and subscriber data with real-time network threat detection. TruContext delivers carrier-grade cybersecurity for telecommunications providers ensuring network integrity, subscriber privacy, and regulatory compliance with NIST, 3GPP, and telecom-specific security standards.
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

        {/* The Challenge */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              The Challenge
            </h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
              Telecommunications networks face sophisticated threats targeting infrastructure, subscriber data, and service availability. 5G deployment introduces new attack surfaces including virtualized network functions and edge computing. Legacy security tools struggle to monitor distributed networks, detect insider threats, and maintain compliance with NIST, 3GPP, and telecom-specific security requirements.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Infrastructure Attacks</h3>
                      <p className="text-gray-600">Threats targeting network core, RAN, and edge computing systems</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Subscriber Data Breaches</h3>
                      <p className="text-gray-600">Unauthorized access to customer data and location information</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Lock className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Regulatory Complexity</h3>
                      <p className="text-gray-600">NIST, 3GPP, GDPR, and telecom-specific compliance requirements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Carrier-Grade Network Security & Threat Detection
            </h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
              TruContext is a telecommunications network security platform delivering real-time threat detection for 5G networks, network infrastructure, and subscriber systems. Our network threat detection solution monitors distributed telecom environments while ensuring NIST, 3GPP, and regulatory compliance.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <Radio className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">5G Network Security</h3>
                  </div>
                  <p className="text-gray-600">
                    Monitor 5G core network, RAN (Radio Access Network), and edge computing infrastructure. Detect threats targeting virtualized network functions, SDN controllers, and NFV platforms. Protect against DDoS, signaling attacks, and infrastructure compromise.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <Shield className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Subscriber Data Protection</h3>
                  </div>
                  <p className="text-gray-600">
                    Real-time monitoring of subscriber databases, location services, and customer data systems. Detect unauthorized access, data exfiltration, and insider threats targeting customer information and location data.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Network Anomaly Detection</h3>
                  </div>
                  <p className="text-gray-600">
                    Identify unusual traffic patterns, signaling anomalies, and network behavior changes. Detect DDoS campaigns, botnet activity, and insider threats across network infrastructure and subscriber systems.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Compliance Automation</h3>
                  </div>
                  <p className="text-gray-600">
                    Automated monitoring of NIST, 3GPP, GDPR, and telecom-specific security requirements. Generate compliance reports and demonstrate security controls to regulators and auditors.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Key Telecom Network Security Capabilities</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Network Traffic Analysis</p>
                    <p className="text-sm text-gray-600">Real-time analysis of signaling, user plane, and management traffic</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">DDoS Detection & Mitigation</p>
                    <p className="text-sm text-gray-600">Detect volumetric, protocol, and application-layer DDoS attacks</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Insider Threat Detection</p>
                    <p className="text-sm text-gray-600">Monitor employee and contractor access to network systems</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Vulnerability Management</p>
                    <p className="text-sm text-gray-600">Identify and track vulnerabilities in network infrastructure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proven ROI */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Proven Telecom Network Security ROI
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    <CountUp end={80} suffix="%" />
                  </div>
                  <p className="text-gray-600 font-semibold">Threat Detection Improvement</p>
                  <p className="text-sm text-gray-500 mt-2">Detect threats before service impact</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">
                    <CountUp end={75} suffix="%" />
                  </div>
                  <p className="text-gray-600 font-semibold">Faster Incident Response</p>
                  <p className="text-sm text-gray-500 mt-2">Minimize network downtime</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    <CountUp end={90} suffix="%" />
                  </div>
                  <p className="text-gray-600 font-semibold">Compliance Automation</p>
                  <p className="text-sm text-gray-500 mt-2">Reduce audit burden</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Telecom Network Security Metrics</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-2"><strong>Service Availability:</strong> Detect and stop attacks before service disruption</p>
                  <p className="text-gray-700 mb-2"><strong>Compliance Audit Readiness:</strong> Automated documentation for NIST, 3GPP, GDPR, and telecom regulations</p>
                </div>
                <div>
                  <p className="text-gray-700 mb-2"><strong>Subscriber Trust:</strong> Demonstrate data protection and security controls to customers</p>
                  <p className="text-gray-700 mb-2"><strong>Network Integrity:</strong> Ensure 5G and legacy network infrastructure security</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Regulatory Compliance & Standards
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">5G & Network Standards</h3>
                  <p className="text-gray-600 mb-4">
                    Compliance with 3GPP security specifications, NIST Cybersecurity Framework, and telecom-specific security requirements for 5G networks and infrastructure.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ 3GPP security specifications</li>
                    <li>✓ NIST Cybersecurity Framework</li>
                    <li>✓ Network infrastructure security</li>
                    <li>✓ 5G core and RAN security</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Privacy & Data Protection</h3>
                  <p className="text-gray-600 mb-4">
                    Support for GDPR, CCPA, and telecom-specific privacy regulations protecting subscriber data and customer information.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ GDPR compliance</li>
                    <li>✓ CCPA and state privacy laws</li>
                    <li>✓ Subscriber data protection</li>
                    <li>✓ Location data privacy</li>
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
              Secure Your Telecom Network with 5G-Ready Threat Detection
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              See how TruContext helps telecommunications providers detect threats, protect subscriber data, and maintain regulatory compliance
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
