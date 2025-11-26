import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Users, 
  Lightbulb, 
  Rocket,
  Heart,
  TrendingUp,
  Globe,
  Zap,
  Mail
} from "lucide-react";

export default function Careers() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-blue-50 to-purple-50 py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Briefcase className="h-4 w-4" />
              Join Our Team
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Build the Future of Intelligence
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              At Visium Technologies, we're pioneering the next generation of agentic AI-powered security and intelligence platforms. Join a team of innovators, problem-solvers, and visionaries who are transforming how organizations understand and protect their digital ecosystems.
            </p>
          </div>
        </div>
      </section>

      {/* Why Visium Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Work at Visium?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're not just building software—we're shaping the future of cybersecurity and intelligence analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Cutting-Edge Technology</h3>
                <p className="text-gray-600">
                  Work with advanced graph databases, agentic AI, and real-time analytics that power mission-critical systems for government and enterprise clients
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation-Driven Culture</h3>
                <p className="text-gray-600">
                  Your ideas matter. We encourage creative thinking, experimentation, and continuous learning in an environment that values innovation
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Growth Opportunities</h3>
                <p className="text-gray-600">
                  Accelerate your career with challenging projects, mentorship from industry experts, and opportunities to make a real impact
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Collaborative Team</h3>
                <p className="text-gray-600">
                  Join a diverse, talented team where collaboration and knowledge-sharing are at the heart of everything we do
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Meaningful Work</h3>
                <p className="text-gray-600">
                  Contribute to solutions that protect critical infrastructure, enhance public safety, and defend against cyber threats
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Work-Life Balance</h3>
                <p className="text-gray-600">
                  We value your well-being with flexible work arrangements, competitive benefits, and a supportive environment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Opportunities Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/20 shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Exciting Opportunities Coming Soon!
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  We're growing fast and constantly looking for exceptional talent to join our team. While we don't have any open positions at the moment, we're always interested in connecting with passionate individuals who want to make a difference.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Check back regularly for new openings, or reach out to us directly to introduce yourself. We'd love to hear from you!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-8"
                    onClick={() => window.location.href = 'mailto:info@visiumtechnologies.com?subject=Career Inquiry - Resume Submission'}
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Email Us Your Resume
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8"
                    onClick={() => window.location.href = 'https://www.linkedin.com/company/visium-technologies'}
                  >
                    Follow Us on LinkedIn
                  </Button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Visium Technologies is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Areas of Interest */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Roles We're Always Interested In
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-primary">Engineering & Development</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Full-Stack Developers (React, Node.js, TypeScript)</li>
                    <li>• AI/ML Engineers (Graph Neural Networks, LLMs)</li>
                    <li>• Backend Engineers (Neo4j, PostgreSQL, Kafka)</li>
                    <li>• DevOps Engineers (Kubernetes, AWS, CI/CD)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-primary">Product & Design</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Product Managers (Cybersecurity, Intelligence)</li>
                    <li>• UX/UI Designers (Data Visualization, Dashboards)</li>
                    <li>• Technical Writers (Documentation, Training)</li>
                    <li>• Solutions Architects (Enterprise Integration)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-primary">Sales & Business Development</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Account Executives (Government, Enterprise)</li>
                    <li>• Solutions Engineers (Pre-Sales, Demos)</li>
                    <li>• Business Development Managers</li>
                    <li>• Customer Success Managers</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-primary">Operations & Support</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Technical Support Engineers</li>
                    <li>• Implementation Specialists</li>
                    <li>• Data Analysts</li>
                    <li>• Quality Assurance Engineers</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
