import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink } from "lucide-react";

interface Video {
  title: string;
  url: string;
  duration: string;
  views: string;
  description?: string;
  thumbnail?: string;
}

// Helper function to extract Rumble video ID and generate thumbnail URL
// Rumble thumbnails are hosted on their CDN, but the URLs are complex
// For now, we'll use a generic approach that attempts common patterns
const getRumbleThumbnail = (url: string): string => {
  // Extract video ID (e.g., v1ca1ux from https://rumble.com/v1ca1ux-trucontext-onboarding.html)
  const match = url.match(/rumble\.com\/(v[\w]+)/);
  if (match && match[1]) {
    const videoId = match[1];
    // Rumble's embed thumbnail pattern - this may not always work but is worth trying
    return `https://rumble.com/${videoId}.jpg`;
  }
  return ''; // fallback to gradient if no match
};

export default function Videos() {
  const industryVideos: Video[] = [
    {
      title: "Insider Threats",
      url: "https://www.youtube.com/shorts/7aar2CnxpKo",
      duration: "0:45",
      views: "1.5K",
      description: "Detect and prevent insider threats with TruContext's advanced behavioral analytics and anomaly detection."
    },
    {
      title: "Smart Cities",
      url: "https://youtube.com/shorts/m9YQl1QfhKo?si=Sj2x-Fwauj7iPUXl",
      duration: "0:58",
      views: "2.1K",
      description: "Unified intelligence for public safety and urban operations with TruContext."
    },
    {
      title: "Campus Security",
      url: "https://youtu.be/jmO6XXxg8sE?si=vZPMX8Wx6QhNdRg8",
      duration: "3:45",
      views: "1.8K",
      description: "Campus Security Initiative with IREX.AI for ethical AI-driven public safety."
    },
    {
      title: "TruContext™ Onboarding",
      url: "https://rumble.com/v1ca1ux-trucontext-onboarding.html",
      duration: "1:58",
      views: "1.36K",
      description: "Customized dashboard for your ecosystem - from cyber and law enforcement to logistics and healthcare."
    },
    {
      title: "TruContext™ ELI and Law Enforcement",
      url: "https://rumble.com/v1c5agd-trucontext-eli-and-law-enforcement.html",
      duration: "2:20",
      views: "458",
      description: "See how TruContext serves law enforcement and emergency response teams."
    },
    {
      title: "Year End 2025 Recap",
      url: "https://youtube.com/shorts/4c6pJO4i1Gk?si=d1vmVNQWaZY6mke",
      duration: "1:12",
      views: "3.2K",
      description: "2025 Year End Recap highlighting Visium Technologies major achievements and innovations."
    },
    {
      title: "Logistics, Ports and Supply Chain",
      url: "https://rumble.com/v1c50iv-logistics-ports-and-supply-chain.html",
      duration: "2:09",
      views: "712",
      description: "TruContext solutions for logistics, port operations, and supply chain management."
    },
    {
      title: "TruContext Fraud Detection & Anti-Money Laundering",
      url: "https://rumble.com/v1bkf91-trucontext-fraud-detection-and-anti-money-laundering.html",
      duration: "1:54",
      views: "470",
      description: "Advanced fraud detection and AML capabilities powered by graph analytics."
    },
    {
      title: "TruContext Cyber Security",
      url: "https://rumble.com/v1a0kkj-trucontext-cyber-security.html",
      duration: "3:11",
      views: "716",
      description: "Comprehensive cybersecurity threat detection and response with TruContext."
    }
  ];

  const demoVideos: Video[] = [
    {
      title: "Visium TruContext Intro",
      url: "https://rumble.com/vws489-visium-trucontext-intro.html",
      duration: "2:33",
      views: "21",
      description: "Introduction to the TruContext platform and its core capabilities."
    },
    {
      title: "Visium Analytics TruContext Dashboard Demo",
      url: "https://rumble.com/vr6p3h-trucontext-dashboard-demo.html",
      duration: "6:58",
      views: "1.39K",
      description: "Comprehensive walkthrough of the TruContext dashboard interface and features."
    },
    {
      title: "Visium Analytics TruContext Search Demo",
      url: "https://rumble.com/vr6y6d-visium-trucontext-search-demo.html",
      duration: "1:59",
      views: "1.36K",
      description: "Powerful search capabilities across your connected data ecosystem."
    },
    {
      title: "Visium Analytics TruContext TruTime Demo",
      url: "https://rumble.com/vr75rz-visium-analytics-trucontext-trutime-demo.html",
      duration: "1:30",
      views: "1.32K",
      description: "Time-based analysis and temporal correlation features."
    },
    {
      title: "Visium TruContext Cyber Triage Demo",
      url: "https://rumble.com/vr78pt-visium-trucontext-cyber-triage-demo.html",
      duration: "7:54",
      views: "1.3K",
      description: "Step-by-step demonstration of cyber incident triage and investigation workflow."
    },
    {
      title: "Transform Your Raw Data with TruContext™",
      url: "https://rumble.com/vyx3gp-transform-your-raw-data-with-trucontext.html",
      duration: "0:10",
      views: "4",
      description: "Quick overview of TruContext's data transformation capabilities."
    },
    {
      title: "Cygraph Introduction",
      url: "https://rumble.com/vech3l-cygraph-introduction.html",
      duration: "2:33",
      views: "33.1K",
      description: "Introduction to Cygraph, the graph database technology powering TruContext."
    }
  ];

  const interviewVideos: Video[] = [
    {
      title: "Benzinga Interviews CEO Mark Lucky",
      url: "https://rumble.com/v157efu-benzinga-interviewed-our-ceo-mark-lucky-to-highlight-trucontext-and-our-tec.html",
      duration: "8:28",
      views: "17",
      description: "CEO Mark Lucky discusses Visium Technologies' vision and TruContext platform."
    },
    {
      title: "Benzinga Interviews Solomon Adote, Director + Chief Security Officer",
      url: "https://rumble.com/v17x36i-benzinga-interviews-solomon-adote-director-chief-security-officer-for-the-s.html",
      duration: "8:57",
      views: "10",
      description: "CSO Solomon Adote shares insights on cybersecurity and TruContext capabilities."
    }
  ];

  const webinarVideos: Video[] = [
    {
      title: "Visium Carahsoft Webinar - February 22, 2022",
      url: "https://rumble.com/vvoj0j-visium-carahsoft-webinar-22-feb-2022.html",
      duration: "59:41",
      views: "1.1K",
      description: "Full webinar covering TruContext platform features and use cases."
    },
    {
      title: "Visium Carahsoft Webinar 4K",
      url: "https://rumble.com/vvt1m3-visium-carahsoft-webinar-4k-1.html",
      duration: "59:41",
      views: "28",
      description: "High-quality recording of TruContext platform demonstration and Q&A."
    }
  ];

  const VideoCard = ({ video }: { video: Video }) => {
    const thumbnailUrl = video.thumbnail;
    
    return (
      <a href={video.url} target="_blank" rel="noopener noreferrer" className="block">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-video bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 relative flex items-center justify-center group overflow-hidden">
          {thumbnailUrl ? (
            <>
              <img 
                src={thumbnailUrl} 
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient with title if image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <Play className="w-16 h-16 text-white opacity-90" />
              </div>
            </>
          ) : (
            <>
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-32 h-32 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-24 h-24 border-2 border-white rounded-full"></div>
              </div>
              {/* Video title overlay */}
              <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center">
                <h4 className="text-white font-semibold text-lg mb-4 line-clamp-3">{video.title}</h4>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-white/30 transition-colors">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
            </>
          )}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
        </div>
      <div className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 line-clamp-2">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {video.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-gray-500">{video.views} views</span>
          <a href={video.url} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="default" className="text-xs sm:text-sm">
              Watch <ExternalLink className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </a>
        </div>
      </div>
        </Card>
      </a>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-12 sm:py-16">
        <div className="container max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Videos & Webinars
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Explore our collection of product demonstrations, industry solutions, webinars, 
            and interviews showcasing the power of TruContext™ platform.
          </p>
        </div>
      </section>

      {/* Industry & Use Case Videos */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Industry Solutions & Use Cases
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industryVideos.map((video, index) => (
              <VideoCard key={index} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* Product Demos */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Product Demonstrations
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoVideos.map((video, index) => (
              <VideoCard key={index} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* Webinars */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Webinars & Training
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl">
            {webinarVideos.map((video, index) => (
              <VideoCard key={index} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* Interviews */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Leadership Interviews
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl">
            {interviewVideos.map((video, index) => (
              <VideoCard key={index} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Ready to See TruContext in Action?
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Schedule a personalized demo to see how TruContext can transform your data intelligence operations.
          </p>
          <a href="/demo">
            <Button size="lg" className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
              Request a Demo
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
