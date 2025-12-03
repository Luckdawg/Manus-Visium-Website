import { Button } from "@/components/ui/button";
import Tour, { TourStep } from "@/components/Tour";
import TourButton from "@/components/TourButton";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, Network, Cloud, Database, Zap, Lock, Brain, Cpu } from "lucide-react";
import FollowUs from "@/components/FollowUs";

export default function Platform() {
  const tourSteps: TourStep[] = [
    {
      target: ".platform-hero",
      title: "TruContext Platform Overview",
      content: "Explore our agentic AI-powered intelligence platform with dual database architecture that delivers unmatched performance and capabilities.",
      placement: "bottom"
    },
    {
      target: ".dual-database",
      title: "Dual Database Architecture",
      content: "Our patented architecture combines graph database for real-time relationships with relational database for persistent analytics—delivering 4x faster query performance.",
      placement: "top"
    },
    {
      target: ".agentic-ai",
      title: "Agentic AI Capabilities",
      content: "Autonomous AI agents plan and execute complex workflows without human intervention, from icon generation to multi-step threat investigations.",
      placement: "top"
    },
    {
      target: ".platform-features",
      title: "Core Platform Features",
      content: "Discover our comprehensive feature set including real-time processing, advanced analytics, video intelligence, and enterprise security.",
      placement: "top"
    }
  ];

  return (
    <div className="min-h-screen">
      <Tour steps={tourSteps} tourId="platform" />
      <TourButton tourId="platform" label="Platform Tour" />
      {/* Hero Section */}
      <section className="platform-hero gradient-hero py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              The TruContext <span className="text-primary">Platform</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Agentic AI-powered intelligence platform with dual database architecture that transforms data into actionable insights across cyber, physical, and operational domains
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
      <section className="dual-database py-12 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
                Enterprise-Grade Dual Database Architecture
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                TruContext is built on a revolutionary dual database architecture combining graph database for real-time network relationships with relational database for persistent storage and analytics. This patented scalable multi-layered approach processes billions of events with joins and aggregations in real-time, providing unmatched context and performance that conventional platforms cannot match.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Enhanced from MITRE Corporation's CyGraph platform, originally developed for US Army Cyber Command, TruContext brings defense-grade intelligence capabilities to enterprise organizations with automatic synchronization and zero data loss.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Database className="h-6 w-6 text-primary" />
                  <span className="font-semibold">graph database Graph DB</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="h-6 w-6 text-secondary" />
                  <span className="font-semibold">relational database</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="font-semibold">Real-time Sync</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-secondary" />
                  <span className="font-semibold">Zero Data Loss</span>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="/trucontext_logo.webp" 
                alt="TruContext Platform" 
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Agentic AI Section */}
          <div className="agentic-ai bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mb-12">
            <div className="text-center mb-12">
              <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Agentic AI at the Core
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                TruContext features autonomous AI agents that continuously analyze threats, recommend actions, and automate workflows without human intervention. Our agentic AI capabilities set us apart as a leader in AI-driven cybersecurity solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <Cpu className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">AI Agents</h3>
                  <p className="text-gray-600">
                    Autonomous agents that analyze threats, identify patterns, and execute response workflows automatically
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20">
                <CardContent className="p-6">
                  <Brain className="h-10 w-10 text-secondary mb-4" />
                  <h3 className="text-lg font-bold mb-2">AI Dashboards</h3>
                  <p className="text-gray-600">
                    Intelligent dashboards that adapt to user roles and automatically surface critical insights
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">AI Icon Generation</h3>
                  <p className="text-gray-600">
                    Dual API system with Recraft.ai and Gemini for automated icon generation and asset management
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Key Features */}
          <div className="platform-features grid md:grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <Card className="border-t-4 border-t-primary">
              <CardContent className="p-6">
                <Database className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Real-Time Processing</h3>
                <p className="text-gray-600">
                  Process billions of events in real-time with advanced joins, aggregations, and complex queries across multiple data sources using our dual database architecture
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-secondary">
              <CardContent className="p-6">
                <Network className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-3">Advanced Graph Analytics</h3>
                <p className="text-gray-600">
                  Interactive network graphs with multiple layout algorithms (Cola, ELK, Klay) and dynamic styling based on threat levels and relationships
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary">
              <CardContent className="p-6">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Kafka Ecosystem</h3>
                <p className="text-gray-600">
                  Incorporates rapid high throughput and scalable processing via the Kafka ecosystem for enterprise-scale deployments with live data synchronization
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-secondary">
              <CardContent className="p-6">
                <Cloud className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-3">Geospatial Intelligence</h3>
                <p className="text-gray-600">
                  Persistent geographic coordinate assignment with dual database storage, real-time map updates, and continuous integration capabilities
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Threat Path Analysis</h3>
                <p className="text-gray-600">
                  Comprehensive attack chain visualization and analysis with MITRE ATT&CK integration for threat-informed defense strategies
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-secondary">
              <CardContent className="p-6">
                <Brain className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-3">Multi-View Dashboards</h3>
                <p className="text-gray-600">
                  Tailored dashboard views for Executive, SOC, Threat Analysis, Geographic Map, AI Agents, and AI-driven insights
                </p>
              </CardContent>
            </Card>
          </div>

          {/* MITRE Heritage */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-10">
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
            <div className="grid md:grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Follow Us Section */}
      <FollowUs />

      {/* Platform Components CTA */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">Explore Platform Capabilities</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Discover how TruContext's agentic AI-powered features and video intelligence transform your operations
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
