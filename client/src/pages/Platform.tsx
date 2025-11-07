import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, Network, Cloud, Database, Zap, Lock } from "lucide-react";

export default function Platform() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              The TruContext <span className="text-primary">Platform</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              AI-powered intelligence platform that transforms data into actionable insights across cyber, physical, and operational domains
            </p>
            <Link href="/demo">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Multi-Layered Graph Database Technology
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                TruContext is built on a patented scalable multi-layered graph database that processes billions of events with joins and aggregations in real-time. This revolutionary architecture provides unmatched context and performance that conventional platforms cannot match.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Enhanced from MITRE Corporation's CyGraph platform, originally developed for US Army Cyber Command, TruContext brings defense-grade intelligence capabilities to enterprise organizations.
              </p>
            </div>
            <div>
              <img 
                src="/trucontext_logo.webp" 
                alt="TruContext Platform" 
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-t-4 border-t-primary">
              <CardContent className="p-6">
                <Database className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Real-Time Processing</h3>
                <p className="text-gray-600">
                  Process billions of events in real-time with advanced joins, aggregations, and complex queries across multiple data sources
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-secondary">
              <CardContent className="p-6">
                <Network className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-3">Multi-Domain Intelligence</h3>
                <p className="text-gray-600">
                  Unified intelligence across cyber, physical, and operational domains for comprehensive situational awareness
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary">
              <CardContent className="p-6">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Kafka Ecosystem</h3>
                <p className="text-gray-600">
                  Incorporates rapid high throughput and scalable processing via the Kafka ecosystem for enterprise-scale deployments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* MITRE Heritage */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Built on Military-Grade Technology
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Enhanced from MITRE Corporation's CyGraph platform, originally developed for US Army Cyber Command. This connection establishes immediate trust and validates the platform's robustness for federal agencies and critical infrastructure operators.
              </p>
              <div className="flex justify-center">
                <img 
                  src="/mitre_attack_logo.webp" 
                  alt="MITRE ATT&CK" 
                  className="h-16"
                />
              </div>
            </div>
          </div>

          {/* Deployment Options */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Flexible Deployment Options</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Cloud className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Cloud-Native SaaS</h3>
                  <p className="text-gray-600">
                    Deploy on AWS, Azure, or GCP with full scalability and managed services
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Lock className="h-12 w-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">On-Premises</h3>
                  <p className="text-gray-600">
                    Virtual appliances for complete data control and network segmentation
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Network className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Hybrid & Edge</h3>
                  <p className="text-gray-600">
                    Hybrid deployments and edge computing for low-latency applications
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Components CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Explore Platform Capabilities</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Discover how TruContext's AI-powered features and video intelligence transform your operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/platform/ai-capabilities">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                AI Capabilities
              </Button>
            </Link>
            <Link href="/platform/tru-insight">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Tru-InSight™ Video Intelligence
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
