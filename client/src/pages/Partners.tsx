import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Handshake, Users, TrendingUp, CheckCircle2, Shield } from "lucide-react";

export default function Partners() {
  const technologyPartners = [
    {
      name: "Datadog",
      logo: "/partner_datadog.webp",
      description: "Essential monitoring and security platform for cloud-scale applications"
    },
    {
      name: "Tenable",
      logo: "/partner_tenable.webp",
      description: "Risk-based view of IT, security, and compliance across the enterprise"
    },
    {
      name: "Splunk",
      logo: "/partner_splunk.webp",
      description: "World's first Data-to-Everything Platform for security and observability"
    },
    {
      name: "Nutanix",
      logo: "/partner_nutanix.webp",
      description: "Leader in hyper-converged infrastructure and enterprise cloud platforms"
    },
    {
      name: "IREX",
      logo: "/partner_irex.webp",
      description: "Joint product offering for AI-powered security camera integration"
    },
    {
      name: "AWS",
      logo: "/partner_aws.webp",
      description: "Cloud infrastructure partnership for scalable, reliable deployment"
    },
    {
      name: "MITRE",
      logo: "/partner_mitre.webp",
      description: "Strategic partnership leveraging MITRE ATT&CK framework and Cygraph technology"
    },
    {
      name: "Carahsoft",
      logo: "/partner_carahsoft.webp",
      description: "Government contracting and public sector distribution partner"
    },
    {
      name: "MicroTech",
      logo: "/partner_microtech.webp",
      description: "Federal government IT solutions and services partnership"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Handshake className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Partner <span className="text-primary">Ecosystem</span>
            </h1>
            <p className="text-xl text-gray-600">
              Visium works with partners to promote cybersecurity on all scales, delivering innovative solutions through strategic alliances and technology integrations
            </p>
          </div>
        </div>
      </section>

      {/* Partner Program Overview */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Partner Program</h2>
            <p className="text-xl text-gray-600 mb-8">
              Visium partners with organizations that offer complementary expertise, skills, technology solutions, and services. Our partnership distinguishes your business, builds your network, connects you with new prospects, and gives you incomparable access to one of the most exciting movements in enterprise software.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-t-primary">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Strategic Alliance Partners</h3>
                <p className="text-sm text-gray-600">
                  Long-term partnerships for joint solutions and market expansion
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-t-secondary">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-secondary mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">License Resellers</h3>
                <p className="text-sm text-gray-600">
                  Authorized resellers delivering TruContext to end customers
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-t-primary">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Service Providers</h3>
                <p className="text-sm text-gray-600">
                  Professional services and managed security service providers
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-t-secondary">
              <CardContent className="p-6">
                <Handshake className="h-12 w-12 text-secondary mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Integration Partners</h3>
                <p className="text-sm text-gray-600">
                  Technology integrations and complementary solution providers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Partners</h2>
            <p className="text-xl text-gray-600">
              Visium has entered into partnerships to host the new TruContext™ SaaS model, providing redundancy, high availability, and scalability to our evolving platform. We collaborate with industry leaders to deliver comprehensive cybersecurity solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologyPartners.map((partner, index) => (
              <Card key={index} className="hover:shadow-xl transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="bg-white rounded-lg p-6 mb-4 flex items-center justify-center min-h-[120px]">
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="max-w-full max-h-[80px] object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{partner.name}</h3>
                  <p className="text-gray-600 text-sm">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* We Make Great Products Better Together */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              We Make Great Products Better Together
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Visium partners with organizations that offer complementary expertise, skills, technology solutions, and services. Our partnership distinguishes your business, builds your network, connects you with new prospects, and gives you incomparable access to one of the most exciting movements in enterprise software.
            </p>
          </div>

          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-primary/20">
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Call attention to your organization by joining forces with Visium. Leverage our highly demanded tool and graphing technology to drive customer value and build a new class of solutions. No matter your specialty, we look forward to helping you succeed because at Visium we are committed to supporting our partners.
              </p>
              <div className="text-center">
                <Link href="/demo">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Sign Up to Become a Partner Today
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Partner Benefits</h2>
            <p className="text-xl text-gray-600">
              Why leading organizations choose to partner with Visium Analytics
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Cutting-Edge Technology</h3>
                    <p className="text-gray-600">
                      Access to agentic AI-powered cybersecurity platform with dual database architecture and real-time threat intelligence
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Competitive Margins</h3>
                    <p className="text-gray-600">
                      Attractive partner pricing and revenue sharing models designed to maximize profitability
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Dedicated Support</h3>
                    <p className="text-gray-600">
                      Partner enablement team providing technical training, sales support, and marketing resources
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Market Opportunity</h3>
                    <p className="text-gray-600">
                      Tap into the rapidly growing cybersecurity market with differentiated AI-powered solutions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Co-Marketing Programs</h3>
                    <p className="text-gray-600">
                      Joint marketing initiatives, case studies, and co-branded materials to drive demand
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Government Contracts</h3>
                    <p className="text-gray-600">
                      Access to SEWP V and ITES-SW 2 contract vehicles for federal government sales
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Purchasing Contract Vehicles */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Purchasing Contract Vehicles</h2>
            <p className="text-xl text-gray-600">
              Streamlined procurement for federal agencies and authorized contractors
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">SEWP V (NASA)</h3>
                <p className="text-gray-700 mb-4">
                  The Solutions for Enterprise-Wide Procurement (SEWP V) Government-Wide Acquisition Contract provides the latest in information technology products and associated services for all U.S. Federal Agencies, including the Department of Defense and authorized contractors.
                </p>
                <p className="text-gray-700">
                  The contract is administered by the NASA SEWP Program Office, who processes orders issued by agencies, provides customer service, and manages contractor relations. SEWP offers low prices with an efficient ordering process using pre-competed contracts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-secondary">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">ITES-SW 2 (U.S. Army)</h3>
                <p className="text-gray-700">
                  The purpose of the ITES-SW 2 acquisition is to support Army, Department of Defense (DoD), and all Federal Agency enterprise Information Technology (IT) infrastructure goals by leveraging Commercially available Off-The-Shelf (COTS) software products and maintenance in 14 product categories, in addition to related incidental services and hardware. These 14 categories align with the major software categories identified by U.S. Army Network Enterprise Technology Command (NETCOM).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Partner with Visium?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our ecosystem and deliver cutting-edge agentic AI-powered cybersecurity solutions to your customers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Become a Partner
              </Button>
            </Link>
            <Link href="/company/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Partner Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
