import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Brain, TrendingUp, Network, RefreshCw, MessageSquare, Zap } from "lucide-react";

export default function AICapabilities() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Agentic AI: <span className="text-primary">Autonomous Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              TruContext features autonomous AI agents that continuously analyze threats, recommend actions, and automate workflows. Our agentic AI capabilities transform raw data into predictive intelligence without human intervention.
            </p>
            <Link href="/demo">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                See AI in Action
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI at the Core */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Agentic AI: The Next Evolution</h2>
            <p className="text-xl text-gray-600">
              Unlike platforms where AI is merely an add-on feature, TruContext features autonomous AI agents embedded in every layer of analysis and visualization. These intelligent agents work independently to analyze threats, identify patterns, and execute response workflows automatically. This agentic AI approach enables contextual differentiation that moves organizations from reactive alert management to proactive threat prevention, positioning Visium Analytics as a leader in AI-driven cybersecurity solutions.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                From Reactive to Predictive
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                While other platforms show you <strong>what happened</strong>, TruContext provides superior value by showing:
              </p>
              <ul className="space-y-3 text-lg text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span><strong>What happened</strong> - Complete event timeline</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span><strong>Why it matters</strong> - Business impact analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span><strong>What's connected</strong> - Relationship mapping</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span><strong>What's likely to happen next</strong> - Predictive intelligence</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="text-center">
                <Brain className="h-24 w-24 text-primary mx-auto mb-6" />
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  75% Reduction in MTTD
                </h4>
                <p className="text-gray-700">
                  Most customers see actionable insights within 30 days of deployment, achieving dramatic reductions in Mean Time to Detect
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core AI Capabilities */}
      <section className="py-20 gradient-purple-blue">
        <div className="container">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Core AI Capabilities</h2>
          
          <div className="space-y-8">
            {/* Machine Learning & Pattern Recognition */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Brain className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="lg:col-span-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Machine Learning & Pattern Recognition
                    </h3>
                    <p className="text-lg text-gray-700">
                      The AI engine continuously analyzes data streams to identify patterns, anomalies, and complex relationships that are impossible for human analysts to detect manually. The system is engineered to learn the normal behavior of your environment and flag deviations indicating potential threats or opportunities. This capability processes billions of events in real-time, correlating data across multiple dimensions to surface hidden connections and emerging patterns.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Predictive Analytics */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-2">
                    <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-secondary" />
                    </div>
                  </div>
                  <div className="lg:col-span-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Predictive Analytics
                    </h3>
                    <p className="text-lg text-gray-700">
                      TruContext's proactive nature utilizes both historical and real-time data feeds to forecast potential security incidents, operational disruptions, and business trends before they materialize. This predictive capability enables teams to act proactively rather than reactively, shifting from incident response to incident prevention. The platform analyzes trends, identifies early warning indicators, and provides actionable recommendations to prevent issues before they impact operations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Automated Threat Correlation */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Network className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="lg:col-span-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Automated Threat Correlation
                    </h3>
                    <p className="text-lg text-gray-700">
                      The AI automatically correlates threat indicators across myriad data sources, linking seemingly disparate events to expose the complete attack chain or operational failure. This reduces investigation time from days to seconds by automatically connecting dots that would take human analysts hours or days to discover. The system integrates with SIEM, EDR, firewalls, and other security tools to provide a unified view of threats across your entire infrastructure.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continuous Learning */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-2">
                    <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 text-secondary" />
                    </div>
                  </div>
                  <div className="lg:col-span-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Continuous Learning
                    </h3>
                    <p className="text-lg text-gray-700">
                      The self-improving capability ensures that the platform continuously refines its models and improves accuracy based on the unique data patterns and feedback loop inherent in your deployment environment. As the system processes more data and receives feedback from security teams, it becomes increasingly accurate at identifying threats specific to your organization. This adaptive learning means the platform becomes more valuable over time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Natural Language Queries */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="lg:col-span-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Natural Language Queries
                    </h3>
                    <p className="text-lg text-gray-700">
                      This critical User Experience (UX) benefit allows users to query their security posture or operations using plain English, with the AI providing precise answers and visual representations. Instead of learning complex query languages or navigating through multiple dashboards, analysts can simply ask questions like "Show me all failed login attempts from external IPs in the last 24 hours" and receive instant, actionable results with visual context.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI-Powered Icon Generation */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-2">
                    <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Zap className="h-8 w-8 text-secondary" />
                    </div>
                  </div>
                  <div className="lg:col-span-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      AI-Powered Icon Generation
                    </h3>
                    <p className="text-lg text-gray-700">
                      TruContext features a sophisticated dual API system with Recraft.ai as primary and Gemini as fallback for automated icon generation and asset management. This PostgreSQL-powered icon mapping system with Cloudinary integration enables dynamic visualization of network assets with preview and approval workflows. The system automatically generates contextually appropriate icons for new assets, maintaining visual consistency across the platform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Autonomous AI Agents */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Brain className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="lg:col-span-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Autonomous AI Agents
                    </h3>
                    <p className="text-lg text-gray-700">
                      TruContext's agentic AI capabilities include autonomous agents that work independently to analyze threats, execute response workflows, and make intelligent decisions without human intervention. These AI agents continuously monitor your environment, correlate data across multiple sources, and proactively identify emerging threats. The agents learn from each interaction, becoming more effective over time and adapting to your organization's unique threat landscape.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Proven Results</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-t-4 border-t-primary">
              <CardContent className="p-8">
                <div className="text-5xl font-bold text-primary mb-2">75%</div>
                <p className="text-lg font-semibold text-gray-900 mb-2">Reduction in MTTD</p>
                <p className="text-gray-600">Mean Time to Detect threats dramatically reduced</p>
              </CardContent>
            </Card>

            <Card className="text-center border-t-4 border-t-secondary">
              <CardContent className="p-8">
                <div className="text-5xl font-bold text-secondary mb-2">60%</div>
                <p className="text-lg font-semibold text-gray-900 mb-2">Faster Response</p>
                <p className="text-gray-600">Incident response time cut by more than half</p>
              </CardContent>
            </Card>

            <Card className="text-center border-t-4 border-t-primary">
              <CardContent className="p-8">
                <div className="text-5xl font-bold text-primary mb-2">90%</div>
                <p className="text-lg font-semibold text-gray-900 mb-2">Fewer False Positives</p>
                <p className="text-gray-600">Reduction in alert fatigue and wasted investigation time</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* MITRE ATT&CK Integration */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <img 
              src="/mitre_attack_logo.webp" 
              alt="MITRE ATT&CK" 
              className="mx-auto h-20 mb-6"
            />
            <h2 className="text-3xl font-bold mb-6">MITRE ATT&CK Framework Integration</h2>
            <p className="text-xl text-blue-100 mb-8">
              TruContext integrates the MITRE ATT&CK framework for threat-informed defense, mapping detected threats to known adversarial tactics, techniques, and procedures (TTPs) to provide context and guide response strategies.
            </p>
            <Link href="/platform/technology">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Explore Technology & Integrations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Experience AI-Powered Intelligence</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            See how TruContext's AI capabilities can transform your security operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Schedule a Demo
              </Button>
            </Link>
            <Link href="/platform/tru-insight">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Explore Tru-InSight™
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
