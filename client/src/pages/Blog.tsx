import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { BookOpen, Calendar, ArrowRight, TrendingUp } from "lucide-react";

export default function Blog() {
  const blogPosts = [
    {
      title: "FAQ – Frequently Asked Questions",
      date: "July 14, 2022",
      category: "CEO Corner",
      excerpt: "To Visium Technologies shareholders and interested investors: We often receive questions from interested parties at info@visiumtechnologies.com, and therefore are providing this first in a series of periodic updates addressing common questions about our TruContext platform, technology roadmap, and business strategy.",
      image: "/blog_faq.png",
      slug: "faq-frequently-asked-questions"
    },
    {
      title: "Securing the Supply Chain from Cyber Threats",
      date: "May 25, 2022",
      category: "Cyber Security",
      excerpt: "A supply chain attack, also called a third-party attack, occurs when a bad actor infiltrates your system through an outside provider with access to your network. These attacks have become increasingly sophisticated, targeting the weakest links in complex supply chains to gain access to high-value targets.",
      image: "/blog_supply_chain.png",
      slug: "securing-supply-chain-cyber-threats"
    },
    {
      title: "$VISM Visium, Inc – Benzinga Interview with CEO Mark Lucky",
      date: "May 22, 2022",
      category: "CEO Corner",
      excerpt: "In this exclusive interview, CEO Mark Lucky discusses Visium's vision for transforming cybersecurity through agentic AI-powered intelligence, the company's strategic partnerships with industry leaders, and our roadmap for delivering unprecedented visibility into enterprise cyber threats.",
      image: "/blog_interview.png",
      slug: "benzinga-interview-ceo-mark-lucky"
    },
    {
      title: "Addressing the Cyber Skills Shortage",
      date: "April 5, 2022",
      category: "Cyber Security",
      excerpt: "Security teams across the globe face many challenges, not the least of which is trying to deal with an explosion in the number of digital threats while simultaneously managing a critical shortage of skilled cybersecurity professionals. AI-powered automation offers a path forward.",
      image: "/blog_skills_shortage.png",
      slug: "addressing-cyber-skills-shortage"
    },
    {
      title: "Welcome Letter from the CEO",
      date: "March 11, 2022",
      category: "CEO Corner",
      excerpt: "Welcome to the first blog post of a planned series of periodic posts from me, Mark Lucky, the CEO of Visium Technologies. Armed with the insight and experience gained from decades in technology and finance, I'm excited to share our vision for revolutionizing cybersecurity through intelligent data visualization.",
      image: "/blog_welcome.png",
      slug: "welcome-letter-from-ceo"
    },
    {
      title: "Securing Critical Infrastructure in the Age of State-Sponsored Attacks",
      date: "March 1, 2022",
      category: "Cyber Security",
      excerpt: "Critical infrastructure faces unprecedented threats from sophisticated state-sponsored actors. Power grids, water systems, transportation networks, and telecommunications infrastructure require advanced threat detection and response capabilities that traditional security tools cannot provide.",
      image: "/blog_critical_infrastructure.png",
      slug: "securing-critical-infrastructure"
    },
    {
      title: "Securing the Connected City",
      date: "February 15, 2022",
      category: "Smart Cities",
      excerpt: "As cities become increasingly connected through IoT devices, smart sensors, and integrated systems, the attack surface expands exponentially. TruContext provides the visibility and intelligence needed to secure complex urban infrastructure while maintaining operational efficiency.",
      image: "/blog_smart_city.png",
      slug: "securing-connected-city"
    },
    {
      title: "Ransomware 2.0: Fighting Multi-Extortion Attacks with Predictive Analytics",
      date: "January 20, 2022",
      category: "Cyber Security",
      excerpt: "Modern ransomware attacks have evolved beyond simple encryption. Attackers now employ multi-extortion tactics, combining data theft, encryption, and threats of public disclosure. Predictive analytics and AI-powered threat intelligence are essential for staying ahead of these sophisticated campaigns.",
      image: "/blog_ransomware.png",
      slug: "ransomware-predictive-analytics"
    }
  ];

  const categories = ["All", "CEO Corner", "Cyber Security", "Smart Cities", "Healthcare"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Resources & <span className="text-primary">Insights</span>
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              TruContext shows how everything you touch is connected
            </p>
            <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg p-6 border-2 border-primary/20">
              <p className="text-lg text-gray-800 font-semibold mb-2">
                "You Can't Secure What You Can't See"
              </p>
              <p className="text-sm text-gray-600 italic">
                According to Gartner, "By 2025, graph technologies will be used in 80% of data and analytics innovations, up from 10% in 2021, facilitating rapid decision making across the enterprise."
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Source: Gartner, Top Trends in Data and Analytics for 2021, Rita Sallam et al., 16 Feb 2021.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all hover:-translate-y-2 group overflow-hidden">
                <CardContent className="p-0">
                  {/* Image Placeholder */}
                  <div className="bg-gradient-to-br from-primary/20 to-secondary/20 h-48 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-10"></div>
                    <BookOpen className="h-20 w-20 text-primary/40 relative z-10" />
                    <div className="absolute top-4 right-4 z-20">
                      <Badge className="bg-white text-primary border-primary">
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <Button variant="link" className="p-0 h-auto text-primary group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-12 bg-white">
        <div className="container max-w-3xl">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Stay Updated with Latest Insights
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Subscribe to receive the latest updates on cybersecurity trends, TruContext platform enhancements, and industry insights from our leadership team
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                />
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Cybersecurity?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Discover how TruContext's agentic AI-powered platform can provide unprecedented visibility into your cyber threats
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Request a Demo
              </Button>
            </Link>
            <Link href="/platform">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Explore Platform
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


