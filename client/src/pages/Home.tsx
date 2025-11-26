import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Tour, { TourStep } from "@/components/Tour";
import TourButton from "@/components/TourButton";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Shield, 
  Eye, 
  Zap, 
  Network, 
  Brain, 
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Building2,
  Heart,
  DollarSign,
  Package,
  Radio,
  Factory
} from "lucide-react";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const tourSteps: TourStep[] = [
    {
      target: ".hero-section",
      title: "Welcome to TruContext!",
      content: "Discover how our agentic AI-powered platform transforms cybersecurity and intelligence operations with autonomous agents and dual database architecture.",
      placement: "bottom"
    },
    {
      target: ".trucontext-overview",
      title: "TruContext Platform Overview",
      content: "Learn how TruContext fuses cyber, physical, and operational data using MITRE ATT&CK framework and advanced graph analytics to provide unmatched context.",
      placement: "top"
    },
    {
      target: ".platform-differentiators",
      title: "Why TruContext?",
      content: "Explore our six core advantages including MITRE heritage, patented technology, agentic AI, and defense-grade provenance that set us apart.",
      placement: "top"
    },
    {
      target: ".key-capabilities",
      title: "Key Capabilities",
      content: "Discover our powerful features: real-time threat detection, advanced graph analytics, video intelligence, and supply chain security.",
      placement: "top"
    },
    {
      target: ".industry-solutions",
      title: "Industry Solutions",
      content: "See how TruContext serves 8 vertical markets from cybersecurity to smart cities, each with proven ROI and measurable outcomes.",
      placement: "top"
    },
    {
      target: ".cta-section",
      title: "Ready to Get Started?",
      content: "Schedule a consultation to see how TruContext can transform your cybersecurity operations with agentic AI and dual database architecture.",
      placement: "top"
    }
  ];

  return (
    <div className="min-h-screen">
      <Tour steps={tourSteps} tourId="homepage" />
      <TourButton tourId="homepage" label="Take Tour" />
      {/* Hero Section */}
      <section className="hero-section gradient-hero dot-pattern py-12 lg:py-12 md:py-20">
        <div className="container">
          <div className="grid lg:grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
            <h1 className="text-3xl md:text-5xl lg:text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Agentic AI-Powered <span className="text-primary">Intelligence Platform</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Visium's TruContext is the leader in agentic AI-driven data analytics and cybersecurity solutions, featuring autonomous AI agents that continuously analyze threats and automate workflows. Our dual database architecture (Neo4j + PostgreSQL) fuses cyber, physical, and operational data to provide unmatched context for enterprise security, smart cities, and critical infrastructure protection.
            </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                    Schedule a Consultation
                  </Button>
                </Link>
                <Link href="/platform">
                  <Button size="lg" variant="outline">
                    Explore Platform
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/hero_illustration.webp" 
                alt="TruContext Platform" 
                className="w-full h-auto rounded-lg shadow-2xl object-cover max-h-[500px] md:max-h-[600px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TruContext Overview */}
      <section className="trucontext-overview py-12 bg-white">
        <div className="container">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">AT A GLANCE</p>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Gain Actionable Business Intelligence with <span className="text-secondary">TruContext™</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TruContext is a big data analytics graphing platform that has the ability to process streams of events with joins, aggregations, and more.
            </p>
          </div>

          <div className="grid md:grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-700">
                      Enhanced commercialized version of <strong>MITRE's CyGraph</strong> cyber tool
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-secondary">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-700">
                      The only <strong>Patented Scalable Multi-Layered Graph Database Solution</strong> for Cybersecurity
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-700">
                      Designed for use within the <strong>DoD, Army Cyber Command</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-secondary">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-700">
                      Incorporates the rapid high throughput and scalable processing of data via the <strong>Kafka Ecosystem</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary md:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-700">
                      Has the power to connect to <strong>hundreds of event sources and billions of event sinks</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-6">
              {/* Visium Technologies Logo */}
              <img 
                src="/visium-tech-logo.png" 
                alt="Visium Technologies" 
                className="mx-auto h-16 sm:h-20 md:h-24 object-contain"
              />
              {/* TruContext Logo */}
              <img 
                src="/trucontext_logo.webp" 
                alt="TruContext" 
                className="mx-auto h-12 sm:h-14 md:h-16 object-contain"
              />
          </div>
        </div>
      </section>

      {/* Platform Differentiators */}
      <section className="platform-differentiators py-12 gradient-purple-blue">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Why TruContext</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The only AI-powered platform that shows you what happened, why it matters, what's connected, and what's likely to happen next
            </p>
          </div>

          <div className="grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Military Heritage</h3>
                <p className="text-gray-600">
                  Enhanced from MITRE Corporation's CyGraph platform, originally developed for US Army Cyber Command
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Network className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Patented Technology</h3>
                <p className="text-gray-600">
                  The only patented scalable multi-layered graph database that processes billions of events in real-time
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI at the Core</h3>
                <p className="text-gray-600">
                  Machine learning embedded in every layer of analysis and visualization, not just an add-on feature
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Predictive Intelligence</h3>
                <p className="text-gray-600">
                  Move from reactive alert management to proactive threat prevention with advanced predictive analytics
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Rapid Time to Value</h3>
                <p className="text-gray-600">
                  Most customers see actionable insights within 30 days of deployment
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Complete Context</h3>
                <p className="text-gray-600">
                  Unified view across cyber, physical, and operational domains for comprehensive situational awareness
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="key-capabilities py-12 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
        </div>
        <div className="container relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">TruContext Capabilities</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              TruContext gives analysts the power to analyze threats in real time to quickly isolate incidents, accelerate root cause analysis, and perform advanced modeling
            </p>
          </div>

          <div className="grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Real-Time Situational Awareness</h3>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Predictive Threat Intelligence</h3>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Automated Root Cause Analysis</h3>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Network className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Multi-Dimensional Correlation</h3>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <img 
              src="/nist_framework_graphic.webp" 
              alt="NIST Framework" 
              className="max-w-xs sm:max-w-md w-full h-auto rounded-lg object-contain"
            />
          </div>
        </div>
      </section>

      {/* MITRE ATT&CK */}
      <section className="py-12 bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white">
        <div className="container">
          <div className="text-center mb-8">
            <img 
              src="/mitre_attack_logo.webp" 
              alt="MITRE ATT&CK" 
              className="mx-auto h-16 sm:h-20 md:h-24 mb-6 object-contain"
            />
            <p className="text-xl text-blue-100 max-w-4xl mx-auto">
              TruContext™ applies MITRE's ATT&CK framework — a globally-accessible catalog of adversarial tactics, techniques, and procedures (TTPs). Visium leverages the framework to employ an effective, threat-informed defense.
            </p>
            <Link href="/platform/ai-capabilities">
              <Button size="lg" variant="outline" className="mt-8 bg-white/10 border-white/30 hover:bg-white/20 text-white">
                Learn How to Leverage the Power of MITRE ATT&CK
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="industry-solutions py-12 bg-white">
        <div className="container">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">USE CASES</p>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Making Sense of Complex Connected Data
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              The possibilities of the TruContext platform extend far beyond just cybersecurity. Our advanced graphing capabilities are combined with artificial intelligence and machine learning to provide insight across multiple industries.
            </p>
          </div>

          <div className="grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/solutions/cybersecurity">
              <Card className="hover:shadow-xl transition-all cursor-pointer h-full border-2 border-transparent hover:border-primary">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Cybersecurity</h3>
                  <p className="text-sm text-gray-600">Understand cyber threats, reveal network vulnerabilities</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/solutions/smart-cities">
              <Card className="hover:shadow-xl transition-all cursor-pointer h-full border-2 border-transparent hover:border-secondary">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Smart Cities</h3>
                  <p className="text-sm text-gray-600">Unified intelligence for public safety and urban operations</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/solutions/critical-infrastructure">
              <Card className="hover:shadow-xl transition-all cursor-pointer h-full border-2 border-transparent hover:border-primary">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Critical Infrastructure</h3>
                  <p className="text-sm text-gray-600">Create interactive visualizations of IT/OT/IoT systems</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/solutions/healthcare">
              <Card className="hover:shadow-xl transition-all cursor-pointer h-full border-2 border-transparent hover:border-secondary">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Healthcare</h3>
                  <p className="text-sm text-gray-600">Visualize and analyze connections between patients and care</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/solutions/financial-services">
              <Card className="hover:shadow-xl transition-all cursor-pointer h-full border-2 border-transparent hover:border-primary">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Financial Services</h3>
                  <p className="text-sm text-gray-600">Detect fraud and unusual activities in real-time</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/solutions/supply-chain">
              <Card className="hover:shadow-xl transition-all cursor-pointer h-full border-2 border-transparent hover:border-secondary">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Supply Chain</h3>
                  <p className="text-sm text-gray-600">Explore supply chain data to uncover insights</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/solutions/telecommunications">
              <Card className="hover:shadow-xl transition-all cursor-pointer h-full border-2 border-transparent hover:border-primary">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Radio className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Telecommunications</h3>
                  <p className="text-sm text-gray-600">Network topology and dependency mapping</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/solutions/manufacturing">
              <Card className="hover:shadow-xl transition-all cursor-pointer h-full border-2 border-transparent hover:border-secondary">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Factory className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Manufacturing</h3>
                  <p className="text-sm text-gray-600">Predictive maintenance and quality control</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link href="/solutions/cybersecurity">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Learn More About TruContext Solutions <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-12 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">Ready to Transform Your Data Intelligence?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            See how TruContext can help your organization gain actionable insights within 30 days
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
  );
}
