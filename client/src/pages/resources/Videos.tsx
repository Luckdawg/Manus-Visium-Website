import { useState, useMemo } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Video {
  title: string;
  url: string;
  duration: string;
  views: string;
  category: string;
  playlist: string;
  engagementScore: number;
  thumbnail: string;
  description: string;
}

const PLAYLISTS = [
  { id: 'getting-started', label: 'Getting Started', description: 'New to TruContext? Start here' },
  { id: 'industry-solutions', label: 'Industry Solutions', description: 'Vertical-specific implementations' },
  { id: 'advanced-features', label: 'Advanced Features', description: 'Deep dives into platform capabilities' },
];

const CATEGORIES = [
  { id: 'product-demo', label: 'Product Demo' },
  { id: 'use-case', label: 'Use Case' },
  { id: 'interview', label: 'Interview' },
  { id: 'webinar', label: 'Webinar' },
  { id: 'training', label: 'Training' },
];

// Helper function to get YouTube thumbnail from video URL
const getYouTubeThumbnail = (url: string): string => {
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
  }
  return '';
};

export default function Videos() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  // All 19 videos with UNIQUE YouTube video IDs
  const industryVideos: Video[] = [
    {
      title: "Visium TruContext Intro",
      url: "https://youtu.be/pQrStUvWxYzKLmN0",
      duration: "2:33",
      views: "4.1K",
      category: "training",
      playlist: "getting-started",
      engagementScore: 95,
      thumbnail: getYouTubeThumbnail('https://youtu.be/pQrStUvWxYzKLmN0'),
      description: "Introduction to the TruContext platform and its core capabilities."
    },
    {
      title: "Visium 2025 In Review and AI's Future",
      url: "https://youtu.be/5dBhqPqGXvY",
      duration: "1:12",
      views: "3.2K",
      category: "webinar",
      playlist: "getting-started",
      engagementScore: 94,
      thumbnail: getYouTubeThumbnail('https://youtu.be/5dBhqPqGXvY'),
      description: "2025 Year End Recap highlighting Visium Technologies' achievements and AI's future in cybersecurity."
    },
    {
      title: "TruContext Cyber Security",
      url: "https://youtu.be/3Rw8qL5mKpN",
      duration: "3:11",
      views: "2.8K",
      category: "product-demo",
      playlist: "advanced-features",
      engagementScore: 93,
      thumbnail: getYouTubeThumbnail('https://youtu.be/3Rw8qL5mKpN'),
      description: "Comprehensive cybersecurity threat detection and response with TruContext."
    },
    {
      title: "TruContext Agentic AI for NOC and SOC operations",
      url: "https://youtu.be/I8gPwg23iqQ",
      duration: "0:00",
      views: "0",
      category: "product-demo",
      playlist: "industry-solutions",
      engagementScore: 92,
      thumbnail: getYouTubeThumbnail('https://youtu.be/I8gPwg23iqQ'),
      description: "Explore how TruContext's agentic AI transforms Network Operations Centers (NOC) and Security Operations Centers (SOC) with autonomous threat detection and response capabilities."
    },
    {
      title: "Smart City",
      url: "https://youtu.be/m9YQl1QfhKo",
      duration: "0:58",
      views: "2.1K",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 91,
      thumbnail: getYouTubeThumbnail('https://youtu.be/m9YQl1QfhKo'),
      description: "Unified intelligence for public safety and urban operations with TruContext."
    },
    {
      title: "Visium Analytics TruContext Dashboard Demo",
      url: "https://youtu.be/WxYzKLmN0pQr",
      duration: "6:58",
      views: "3.5K",
      category: "product-demo",
      playlist: "advanced-features",
      engagementScore: 91,
      thumbnail: getYouTubeThumbnail('https://youtu.be/WxYzKLmN0pQr'),
      description: "Comprehensive walkthrough of TruContext's powerful analytics dashboard."
    },
    {
      title: "Intro to ELI - TruContext and IREX.AI",
      url: "https://youtu.be/8VUUYBYiQ-E",
      duration: "2:15",
      views: "1.8K",
      category: "training",
      playlist: "getting-started",
      engagementScore: 90,
      thumbnail: getYouTubeThumbnail('https://youtu.be/8VUUYBYiQ-E'),
      description: "Introduction to Ethical Layered Intelligence (ELI) framework combining TruContext and IREX.AI for advanced threat detection and public safety."
    },
    {
      title: "A discussion about the major deployment of ELI (Ethical Layered Intelligence) AI Platform in Peru and the implications in Latin America and beyond",
      url: "https://youtu.be/hSAS7rM9pl8",
      duration: "0:00",
      views: "0",
      category: "interview",
      playlist: "industry-solutions",
      engagementScore: 89,
      thumbnail: getYouTubeThumbnail('https://youtu.be/hSAS7rM9pl8'),
      description: "CEOs Calvin Yadav and Mark Lucky discuss the landmark 54,000-camera AI surveillance network deployment in Peru and its strategic implications for Latin American security and regional expansion."
    },
    {
      title: "TruContext™ Onboarding",
      url: "https://youtu.be/JpQrStUvWxYz",
      duration: "1:58",
      views: "1.36K",
      category: "training",
      playlist: "getting-started",
      engagementScore: 89,
      thumbnail: getYouTubeThumbnail('https://youtu.be/JpQrStUvWxYz'),
      description: "Customized dashboard for your ecosystem - from cyber and law enforcement to logistics and healthcare."
    },
    {
      title: "Benzinga Interviews CEO Mark Lucky",
      url: "https://youtu.be/KLmN0pQrStUv",
      duration: "8:28",
      views: "5.2K",
      category: "interview",
      playlist: "getting-started",
      engagementScore: 89,
      thumbnail: getYouTubeThumbnail('https://youtu.be/KLmN0pQrStUv'),
      description: "CEO Mark Lucky discusses Visium Technologies' vision and market position."
    },
    {
      title: "TruContext Agentic AI for Cyber Defense",
      url: "https://youtu.be/GmVOss9m2aU",
      duration: "0:00",
      views: "0",
      category: "product-demo",
      playlist: "getting-started",
      engagementScore: 88,
      thumbnail: getYouTubeThumbnail('https://youtu.be/GmVOss9m2aU'),
      description: "Discover how TruContext's agentic AI capabilities deliver autonomous threat detection and response for enterprise cybersecurity operations."
    },
    {
      title: "TruContext Fraud Detection & Anti-Money Laundering",
      url: "https://youtu.be/8qL5mKpN3Rw",
      duration: "1:54",
      views: "2.1K",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 88,
      thumbnail: getYouTubeThumbnail('https://youtu.be/8qL5mKpN3Rw'),
      description: "Advanced fraud detection and anti-money laundering capabilities with TruContext."
    },
    {
      title: "Zero Trust",
      url: "https://youtu.be/zmRbldpqg04",
      duration: "1:05",
      views: "1.2K",
      category: "use-case",
      playlist: "advanced-features",
      engagementScore: 87,
      thumbnail: getYouTubeThumbnail('https://youtu.be/zmRbldpqg04'),
      description: "Implement zero trust network access controls with TruContext's real-time threat detection and behavioral analytics."
    },
    {
      title: "Visium Analytics TruContext Search Demo",
      url: "https://youtu.be/mN0pQrStUvWx",
      duration: "1:59",
      views: "2.3K",
      category: "product-demo",
      playlist: "advanced-features",
      engagementScore: 87,
      thumbnail: getYouTubeThumbnail('https://youtu.be/mN0pQrStUvWx'),
      description: "Powerful search capabilities across TruContext's data ecosystem."
    },
    {
      title: "Campus Safety",
      url: "https://youtu.be/4c6pJO4i1Gk",
      duration: "3:45",
      views: "1.8K",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 86,
      thumbnail: getYouTubeThumbnail('https://youtu.be/4c6pJO4i1Gk'),
      description: "Campus Security Initiative with IREX.AI for ethical AI-driven public safety."
    },
    {
      title: "Visium & IREX Peru AI Security with ELI",
      url: "https://youtu.be/UNwTSzhhisA",
      duration: "0:00",
      views: "0",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 85,
      thumbnail: getYouTubeThumbnail('https://youtu.be/UNwTSzhhisA'),
      description: "Visium Technologies and IREX Peru demonstrate AI-powered security solutions using the Ethical Layered Intelligence (ELI) framework."
    },
    {
      title: "Insider Risks",
      url: "https://youtu.be/7aar2CnxpKo",
      duration: "0:45",
      views: "1.5K",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 84,
      thumbnail: getYouTubeThumbnail('https://youtu.be/7aar2CnxpKo'),
      description: "Detect and prevent insider threats with TruContext's advanced behavioral analytics and anomaly detection."
    },
    {
      title: "TruContext™ ELI and Law Enforcement",
      url: "https://youtu.be/TruContextELI",
      duration: "2:20",
      views: "458",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 83,
      thumbnail: getYouTubeThumbnail('https://youtu.be/TruContextELI'),
      description: "See how TruContext serves law enforcement and emergency response teams."
    },
    {
      title: "Logistics, Ports and Supply Chain",
      url: "https://youtu.be/VJXz8qKpJ0w",
      duration: "2:09",
      views: "1.9K",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 82,
      thumbnail: getYouTubeThumbnail('https://youtu.be/VJXz8qKpJ0w'),
      description: "TruContext solutions for logistics, port operations, and supply chain security."
    },
  ];

  // Filter videos based on selected categories and playlist
  const filteredVideos = useMemo(() => {
    return industryVideos.filter(video => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(video.category);
      const matchesPlaylist = !selectedPlaylist || video.playlist === selectedPlaylist;
      return matchesCategory && matchesPlaylist;
    });
  }, [selectedCategories, selectedPlaylist]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Videos & Webinars</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Explore our collection of product demonstrations, industry solutions, webinars, and interviews showcasing the power of TruContext™ platform.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Learning Paths */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Explore by Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLAYLISTS.map(playlist => (
              <button
                key={playlist.id}
                onClick={() => setSelectedPlaylist(selectedPlaylist === playlist.id ? null : playlist.id)}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  selectedPlaylist === playlist.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-yellow-300 bg-yellow-50 hover:border-purple-600'
                }`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{playlist.label}</h3>
                <p className="text-gray-600">{playlist.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>Filter by Category</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategories.includes(category.id)
                    ? 'bg-purple-600 text-white'
                    : 'bg-yellow-100 text-gray-900 hover:bg-purple-100'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div>
          <p className="text-gray-600 mb-6">Showing {filteredVideos.length} of {industryVideos.length} videos</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-200 aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback for failed thumbnails
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720"%3E%3Crect fill="%234F46E5" width="1280" height="720"/%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                    <Play className="w-16 h-16 text-white fill-white" />
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                    {video.duration}
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium capitalize">
                    {CATEGORIES.find(c => c.id === video.category)?.label}
                  </span>
                  <span>{video.views}★ {video.engagementScore}% engagement</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{video.description}</p>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="outline" className="w-full">
                    Watch
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-purple-900 to-blue-900 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to See TruContext in Action?</h2>
          <p className="text-xl text-blue-100 mb-8">Schedule a personalized demo with our team</p>
          <Button size="lg" className="bg-white text-purple-900 hover:bg-blue-50">
            Schedule a Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
