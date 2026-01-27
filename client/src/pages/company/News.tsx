import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, Calendar, ExternalLink, TrendingUp } from "lucide-react";

export default function News() {
  const newsStories = [
    {
      date: "January 26, 2026",
      title: "Visium Technologies and IREX Advance Peru's National Security Infrastructure with 54,000-Camera AI-Powered Surveillance Network",
      excerpt: "Visium Technologies (OTCBB:VISM) announced significant progress on deployment of the Ethical Layered Intelligence (ELI) platform in Peru, in partnership with IREX.AI. This initiative represents one of the largest unified surveillance deployments in Latin America, integrating up to 54,000 AI-enabled cameras into an eight-city unified command and control center, leveraging IREX's advanced video analytics with Visium's TruContext platform.",
      url: "https://www.einpresswire.com/article/886606810/visium-technologies-and-irex-advance-peru-s-national-security-infrastructure-with-54-000-camera-ai-powered-surveillance-network-amid-escalating-crime",
      source: "EIN Presswire",
      category: "Partnerships"
    },
    {
      date: "December 23, 2025",
      title: "Visium Technologies Announces Campus Security Initiative with IREX.AI to Advance Ethical, AI-Driven Public Safety",
      excerpt: "Visium launches new Campus Security Initiative in partnership with IREX.AI, leveraging ELI™ (Ethical Layered Intelligence) framework to enhance campus safety while upholding transparency, civil liberties, and responsible AI governance. Initiative brings together Visium's TruContext™ platform and IREX.AI's real-time video analytics for higher-education environments.",
      url: "https://www.otcmarkets.com/stock/VISM/news/Visium-Technologies-Announces-Campus-Security-Initiative-with-IREXAI-to-Advance-Ethical-AI-Driven-Public-Safety?id=504927",
      source: "OTC Markets",
      category: "Partnerships"
    },
    {
      date: "December 9, 2025",
      title: "Visium Technologies Enters $1.3 Trillion AI Market with TruContext—The First Fully Transparent Agentic AI Platform",
      excerpt: "Visium Technologies announces bold pivot and transformation into pure-play AI company, launching next generation of mission-critical intelligence. TruContext platform enhanced with Agentic AI capabilities eliminates hallucinations and delivers verifiable intelligence for defense, cybersecurity, and critical infrastructure.",
      url: "https://www.otcmarkets.com/stock/VISM/news/Visium-Technologies-Enters-13-Trillion-AI-Market-with-TruContextThe-First-Fully-Transparent-Agentic-AI-Platform?id=503210",
      source: "OTC Markets",
      category: "Corporate News"
    },
    {
      date: "October 14, 2025",
      title: "Visium Technologies, Inc. Issues Letter to Shareholders",
      excerpt: "Strategic Contracts Establish Foundation for Expansion in High-Growth Emerging Markets Across South America and Africa. Visium Technologies highlights multi-year contracts and partnerships establishing foundation for growth in emerging markets.",
      url: "https://www.einpresswire.com/article/767638942/visium-technologies-inc-issues-letter-to-shareholders",
      source: "EIN Presswire",
      category: "Corporate News"
    },
    {
      date: "October 9, 2025",
      title: "Visium Technologies Selected by IREX.AI for Major Public Safety Technology Deployment in Peru",
      excerpt: "Groundbreaking Partnership to Enhance Urban Security Through Advanced Video Analytics. Visium announced a pivotal contract with IREX.AI for deployment of AI-driven public safety solutions with the Peruvian National Police.",
      url: "https://www.otcmarkets.com/news-otcapi/news/document/content/id?id=85258",
      source: "OTC Markets",
      category: "Partnerships"
    },
    {
      date: "September 23, 2025",
      title: "Visium Technologies Participates in U.S. EXIM Bank Announcement of $100M Financing Guarantee for Africa's Digital Sector",
      excerpt: "Visium Technologies participated in the U.S. Export-Import Bank's announcement of $100 million financing guarantee supporting digital infrastructure development across Africa.",
      url: "https://www.kxan.com/business/press-releases/accesswire/1077188/visium-technologies-participates-in-u-s-exim-bank-announcement-of-100m-financing-guarantee-for-africas-digital-sector",
      source: "AccessWire",
      category: "Industry Events"
    },
    {
      date: "September 16, 2025",
      title: "Visium Technologies Expands TruContext™ with Tru-InSight™",
      excerpt: "Transforming Existing Camera Networks into Proactive Video Intelligence. New module converts passive security footage into an active intelligence layer for preemptive threat detection and rapid investigation.",
      url: "https://www.otcmarkets.com/stock/VISM/news/Visium-Technologies-Expands-TruContextTM-with-Tru-InSightTM---Transforming-Existing-Camera-Networks-into-Proactive-Video?id=492632",
      source: "OTC Markets",
      category: "Product Launch"
    },
    {
      date: "June 30, 2025",
      title: "Visium Technologies Represented at 2025 U.S.-Africa Business Summit",
      excerpt: "Through partnership with GB Group Global, Visium was represented at the 2025 U.S.-Africa Business Summit from June 22-25 in Luanda, Angola, showcasing TruContext platform capabilities.",
      url: "https://www.otcmarkets.com/stock/VISM/news?id=484402",
      source: "OTC Markets",
      category: "Industry Events"
    },
    {
      date: "June 25, 2024",
      title: "Visium Technologies and Angel Consultants Sign Memorandum of Understanding",
      excerpt: "Strategic partnership agreement to collaborate on cybersecurity and analytics solutions for enterprise and government customers.",
      url: "https://www.nasdaq.com/press-release/visium-technologies-and-angel-consultants-sign-memorandum-understanding-2024-06-25",
      source: "NASDAQ",
      category: "Partnerships"
    },
    {
      date: "December 10, 2024",
      title: "Visium Announces Launch of Generative Artificial Intelligence Division",
      excerpt: "Visium Technologies announced the launch of its Generative AI division, expanding capabilities in AI-powered cybersecurity and data analytics solutions.",
      url: "https://www.einpresswire.com/article/767638942/visium-technologies-inc-issues-letter-to-shareholders",
      source: "EIN Presswire",
      category: "Corporate News"
    },
    {
      date: "November 25, 2024",
      title: "Visium Technologies Signs Letter of Intent with Nate Vision & Co. Ltd. to Drive Smart Innovation in Tanzania",
      excerpt: "Project to provide state-of-the-art hub for mining and industrial innovation, leveraging TruContext platform for smart mining operations.",
      url: "https://www.einpresswire.com/newsroom/visium_tech/",
      source: "EIN Presswire",
      category: "Partnerships"
    },
    {
      date: "March 8, 2024",
      title: "IREX AI and Visium Technologies Win Multi-Million Dollar Contract With Peru's Public Service Sector",
      excerpt: "Two-year contract with option for additional 3 years with City of Miraflores for deployment of AI-driven public safety and surveillance solutions.",
      url: "https://www.einpresswire.com/newsroom/visium_tech/",
      source: "EIN Presswire",
      category: "Partnerships"
    },
    {
      date: "March 4, 2022",
      title: "You Can't Secure What You Can't See: Apply TruContext™ to Your Splunk Data",
      excerpt: "Webinar hosted by Splunk, Visium Analytics & Carahsoft demonstrating TruContext integration with Splunk for enhanced cybersecurity visibility.",
      url: "https://www.carahsoft.com/podcast/82-you-can-27t-secure-what-you-can-27t-see-3a-apply-trucontext-e2-84-a2-to-your-splunk-data",
      source: "Carahsoft",
      category: "Webinars"
    }
  ];

  const categories = ["All", "Corporate News", "Partnerships", "Product Launch", "Industry Events", "Webinars"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredNews = selectedCategory === "All"
    ? newsStories
    : newsStories.filter(story => story.category === selectedCategory);

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
            <Newspaper className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              News & <span className="text-primary">Press</span>
            </h1>
            <p className="text-xl text-gray-600">
              Latest announcements, partnerships, and developments from Visium Technologies
            </p>
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

      {/* News Grid */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container max-w-5xl">
          <div className="space-y-6">
            {filteredNews.map((story, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all group">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Date Badge */}
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-lg p-4 text-center min-w-[120px]">
                        <Calendar className="h-6 w-6 mx-auto mb-2" />
                        <div className="text-sm font-semibold">
                          {new Date(story.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {story.title}
                        </h3>
                        <Badge variant="outline" className="flex-shrink-0">
                          {story.category}
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {story.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Source: <span className="font-semibold">{story.source}</span>
                        </div>
                        <a
                          href={story.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
                        >
                          Read Full Story
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* OTC Markets Live News Feed */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Official News Feed from <span className="text-primary">OTC Markets</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Access real-time updates, press releases, and regulatory filings for VISM stock directly from OTC Markets
            </p>
          </div>
          <Card className="border-2 border-primary/20">
            <CardContent className="p-12 text-center">
              <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <ExternalLink className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                View Latest VISM News on OTC Markets
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Get the most up-to-date news, press releases, and company announcements for Visium Technologies (VISM) directly from the official OTC Markets platform. News updates automatically as new releases are published.
              </p>
              <a
                href="https://www.otcmarkets.com/stock/VISM/news"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="text-lg px-8">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Open OTC Markets News Feed
                </Button>
              </a>
              <p className="text-sm text-gray-500 mt-6">
                Opens in new window • Updates automatically • Includes all regulatory filings
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-12 bg-white">
        <div className="container max-w-3xl">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Stay Informed
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Subscribe to receive the latest news, press releases, and company updates from Visium Technologies
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
              <p className="text-sm text-gray-500 mt-4">
                Follow us on social media for real-time updates
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Newspaper className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Press Kit</h3>
                <p className="text-gray-600 mb-4">
                  Download logos, product images, and company information
                </p>
                <Button variant="outline" className="w-full">
                  Download Press Kit
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Investor Relations</h3>
                <p className="text-gray-600 mb-4">
                  View financial reports and investor information
                </p>
                <a href="https://www.otcmarkets.com/stock/VISM/overview" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    Visit OTC Markets
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Media Contact</h3>
                <p className="text-gray-600 mb-4">
                  Get in touch with our media relations team
                </p>
                <a href="mailto:info@visiumtechnologies.com">
                  <Button variant="outline" className="w-full">
                    Contact Media Team
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}


