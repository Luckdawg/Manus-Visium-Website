import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Users, Linkedin, Mail } from "lucide-react";

export default function Leadership() {
  const leaders = [
    {
      name: "Mark Lucky",
      title: "CEO/CFO, Director",
      bio: [
        "Mark Lucky brings over 20 years of experience working as a C-Level executive for small cap public companies, providing strategic leadership and financial oversight to drive growth and operational excellence.",
        "He holds a CPA certification and earned his BA in Economics from UCLA. His career includes significant tenure at prestigious accounting firms KPMG and PricewaterhouseCoopers, where he developed deep expertise in financial management, corporate governance, and strategic planning.",
        "As CEO and CFO of Visium Analytics, Mark leads the company's vision to transform cybersecurity through innovative data visualization and agentic AI-powered intelligence platforms. His financial acumen and operational leadership have been instrumental in positioning Visium as a leader in the cybersecurity analytics space."
      ],
      image: "/mark_lucky.jpg"
    },
    {
      name: "Tom Grbelja",
      title: "Director",
      bio: [
        "Tom Grbelja brings over 30 years of experience as a Certified Public Accountant, with extensive expertise in financial management, corporate governance, and strategic oversight for public companies.",
        "He earned his BS in Accounting from Fairleigh Dickinson University and began his career at Coopers & Lybrand, one of the world's leading accounting firms. Throughout his career, Tom has served as CFO and Director for multiple public companies, providing critical financial leadership during periods of growth and transformation.",
        "As a Director at Visium Analytics, Tom provides invaluable guidance on financial strategy, compliance, and corporate governance, ensuring the company maintains the highest standards of fiscal responsibility while pursuing aggressive growth objectives in the cybersecurity market."
      ],
      image: "/team_placeholder.png"
    },
    {
      name: "Paul Favata",
      title: "Director",
      bio: [
        "Paul Favata is a 29-year Wall Street veteran with extensive experience in capital markets, corporate finance, and strategic business development. His deep understanding of public markets and investor relations brings critical expertise to Visium's board.",
        "As an experienced Public Company Executive and Director, Paul has held leadership positions across IT, Cloud Technology, and professional services sectors. His career spans multiple successful ventures where he has guided companies through critical growth phases, capital raises, and strategic transformations.",
        "At Visium Analytics, Paul provides strategic counsel on business development, market positioning, and growth strategies. His Wall Street experience and technology sector expertise help guide the company's approach to scaling operations, building strategic partnerships, and creating shareholder value in the rapidly evolving cybersecurity market."
      ],
      image: "/team_placeholder.png"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-8">
        <div className="container">
          {/* Visium Technologies Logo - Upper Left */}
          <div className="mb-6">
            <img 
              src="/visium-technologies-logo-new.png" 
              alt="Visium Technologies" 
              className="h-12 sm:h-14 md:h-16 object-contain"
            />
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <Users className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Leadership <span className="text-primary">Team</span>
            </h1>
            <p className="text-xl text-gray-600">
              Meet the experienced executives guiding Visium Analytics' mission to transform cybersecurity through innovative agentic AI-powered intelligence platforms
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl">
          <div className="space-y-16">
            {leaders.map((leader, index) => (
              <Card key={index} className="overflow-hidden border-2 border-gray-100 hover:border-primary/30 transition-all">
                <CardContent className="p-0">
                  <div className={`grid lg:grid-cols-3 gap-6 ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                    {/* Image */}
                    <div className={`${index % 2 === 1 ? 'lg:col-start-3' : ''} bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-12`}>
                      <div className="text-center">
                        {leader.image !== "/team_placeholder.png" ? (
                          <img 
                            src={leader.image} 
                            alt={leader.name}
                            className="w-48 h-48 rounded-full object-cover mx-auto mb-6 border-4 border-white shadow-lg"
                          />
                        ) : (
                          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-6 flex items-center justify-center">
                            <Users className="h-24 w-24 text-white" />
                          </div>
                        )}
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{leader.name}</h3>
                        <p className="text-lg text-primary font-semibold mb-4">{leader.title}</p>
                        <div className="flex justify-center gap-3">
                          <Button variant="outline" size="sm" className="rounded-full">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-full">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className={`lg:col-span-2 p-8 ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                      <div className="space-y-4">
                        {leader.bio.map((paragraph, pIndex) => (
                          <p key={pIndex} className="text-gray-700 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Philosophy */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Leadership Philosophy – Leading with Intelligence, Integrity, and Impact
            </h2>
            <p className="text-2xl text-primary font-semibold mb-8">
              Shaping the Future of Intelligent and Secure Innovation
            </p>
          </div>

          <Card className="border-2 border-primary/20">
            <CardContent className="p-10">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                We lead with a vision to redefine what's possible in a world powered by data, autonomous intelligence, and trust. Our philosophy is rooted in bold thinking and unwavering responsibility—because leadership in technology means more than progress; it means shaping a future that is ethical, secure, and transformative.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Guiding Principles:</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Data-Driven Vision:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Harness the power of analytics to illuminate insights and drive decisions that create lasting impact.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Responsible AI Leadership:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Champion agentic AI that empowers people, augments human potential, and operates with transparency and fairness.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Cybersecurity as a Foundation:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Trust is non-negotiable. Lead with uncompromising security to protect what matters most—our customers, partners, and communities.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Innovation with Purpose:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Every breakthrough must serve a greater good, advancing technology while safeguarding humanity.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Collaboration for Impact:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      The future is built together—through partnerships, diversity of thought, and shared ambition.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-primary/20 pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission in Action:</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To inspire confidence in a digital-first world, we lead by example—creating intelligent solutions that anticipate tomorrow's challenges and deliver transformative outcomes today.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Growing Team</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            We're always looking for talented individuals who share our passion for transforming cybersecurity through innovative technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/company/careers">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                View Open Positions
              </Button>
            </Link>
            <Link href="/company/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
