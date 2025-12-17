import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { BookOpen, Calendar, ArrowRight, Download } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { APP_LOGO } from "@/const";
import BlogLeadCaptureDialog from "@/components/BlogLeadCaptureDialog";

export default function Blog() {
  const blogPosts = [
    {
      title: "The Human Factor: How Agentic AI and Graph Analytics Mitigate Insider Threats",
      date: "December 2025",
      category: "Cyber Security",
      excerpt: "Insider threats—malicious, negligent, or compromised users—remain a top cause of breaches and loss. Visium TruContext combines persistent multi-layer graph modeling with agentic AI to turn noisy user telemetry into precise, prioritized actions that stop insider incidents before they escalate.",
      image: "/blog_insider_threats.png",
      pdfUrl: "/blog_human_factor.pdf"
    },
    {
      title: "From Chaos to Clarity: Visualizing and Acting on Your Attack Surface with TruContext",
      date: "November 2025",
      category: "Cyber Security",
      excerpt: "The enterprise perimeter no longer exists. Cloud, mobile, and IoT growth have created a sprawling, dynamic attack surface full of hidden assets and fast-moving threats. TruContext transforms that chaos into operational clarity by combining multi-layer graph modeling, continuous discovery, and agentic AI.",
      image: "/blog_attack_surface.png",
      pdfUrl: "/blog_chaos_to_clarity.pdf"
    },
    {
      title: "Beyond the Breach: Agentic AI for Proactive Supply Chain Risk Management",
      date: "September 25, 2025",
      category: "Cyber Security",
      excerpt: "With supply chain attacks doubling since April 2025, organizations need more than visibility—they need autonomous intelligence that can detect, reason, and act on risk in real time. TruContext's agentic AI transforms supply chain security from reactive to proactive.",
      image: "/blog_supply_chain.png",
      pdfUrl: "/blog_beyond_breach.pdf"
    },
    {
      title: "Ransomware 2.0: Fighting Multi-Extortion Attacks with Predictive, Agentic AI",
      date: "September 2025",
      category: "Cyber Security",
      excerpt: "Ransomware has evolved into multi-extortion campaigns that combine encryption, data exfiltration, and public shaming. Traditional defenses focused on recovery are no longer enough. TruContext defends with continuous attack-surface modeling, predictive analytics, and agentic AI.",
      image: "/blog_ransomware.png",
      pdfUrl: "/blog_ransomware.pdf"
    },
    {
      title: "Reimagining Campus Security: Ethical AI-Driven Real-Time Video Intelligence",
      date: "December 2025",
      category: "Smart Cities",
      excerpt: "Traditional campus security systems reveal significant gaps in video surveillance coverage and real-time threat detection. TruContext and IREX ELI transform passive camera networks into proactive, real-time, ethically governed video intelligence systems.",
      image: "/blog_campus_security.png",
      pdfUrl: "/blog_campus_security.pdf"
    },
    {
      title: "Securing Critical Infrastructure in the Age of State-Sponsored Attacks",
      date: "September 5, 2025",
      category: "Cyber Security",
      excerpt: "Critical infrastructure has become a prime target for state-sponsored cyberattacks. TruContext is an agentic AI system that autonomously defends critical infrastructure by combining graph analytics with intelligent agents that continuously map, monitor, and mitigate cyber risk.",
      image: "/blog_critical_infrastructure.png",
      pdfUrl: "/blog_critical_infrastructure.pdf"
    },
    {
      title: "Securing the Connected City: Agentic AI That Sees, Reasons, and Acts",
      date: "September 5, 2025",
      category: "Smart Cities",
      excerpt: "Smart cities promise safer, more efficient urban life through connected systems, but connectivity creates an exponentially larger attack surface. TruContext delivers agentic AI that continuously maps the city's digital relationships, reasons about risk, and takes timely action to prevent harm.",
      image: "/blog_smart_city.png",
      pdfUrl: "/blog_connected_city.pdf"
    }
  ];

  const categories = ["All", "CEO Corner", "Cyber Security", "Smart Cities", "Healthcare"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<{ title: string; pdfUrl: string } | null>(null);

  const handleDownloadClick = (title: string, pdfUrl: string) => {
    setSelectedBlog({ title, pdfUrl });
    setLeadDialogOpen(true);
  };

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with Logo */}
      <section className="gradient-hero py-8 relative">
        <div className="container">
          {/* Logo in upper-left */}
          <div className="mb-8">
            <img 
              src={APP_LOGO} 
              alt="Visium Technologies" 
              className="h-12 md:h-14 lg:h-16 w-auto"
            />
          </div>
          
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
                Explore our latest insights on agentic AI, graph analytics, and next-generation cybersecurity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-gray-50 border-b">
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
      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-20 w-20 text-primary/30" />
                  </div>
                  <Badge className="absolute top-4 right-4 bg-white text-primary border-primary">
                    {post.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      className="flex-1"
                      onClick={() => handleDownloadClick(post.title, post.pdfUrl)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lead Capture Dialog */}
      {selectedBlog && (
        <BlogLeadCaptureDialog
          open={leadDialogOpen}
          onOpenChange={setLeadDialogOpen}
          blogTitle={selectedBlog.title}
          pdfUrl={selectedBlog.pdfUrl}
        />
      )}

      <Footer />
    </div>
  );
}
