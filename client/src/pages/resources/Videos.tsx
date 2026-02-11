import { useState } from 'react';
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

  // 16 videos - removed Dashboard Demo, Onboarding, and Benzinga Interview
  const industryVideos: Video[] = [
    {
      title: "Visium TruContext Intro",
      url: "https://youtu.be/g21CdbOvniw?si=cVMSSpgd-nU4xNWh",
      duration: "2:33",
      views: "4.1K",
      category: "training",
      playlist: "getting-started",
      engagementScore: 95,
      thumbnail: getYouTubeThumbnail('https://youtu.be/g21CdbOvniw'),
      description: "Introduction to the TruContext platform and its core capabilities."
    },
    {
      title: "Visium 2025 In Review and AI's Future",
      url: "https://youtu.be/jmO6XXxg8sE?si=UOLnMVzOtBgrewWH",
      duration: "1:12",
      views: "3.2K",
      category: "webinar",
      playlist: "getting-started",
      engagementScore: 94,
      thumbnail: getYouTubeThumbnail('https://youtu.be/jmO6XXxg8sE'),
      description: "2025 Year End Recap highlighting Visium Technologies' achievements and AI's future in cybersecurity."
    },
    {
      title: "TruContext Cyber Security",
      url: "https://youtu.be/SSjWyVWIz6U?si=3xdBKYkL5kTplC-c",
      duration: "3:11",
      views: "2.8K",
      category: "product-demo",
      playlist: "advanced-features",
      engagementScore: 93,
      thumbnail: getYouTubeThumbnail('https://youtu.be/SSjWyVWIz6U'),
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
      url: "https://youtu.be/hSAS7rM9pl8?si=Bt92pzrlHtdIcYB7",
      duration: "0:00",
      views: "0",
      category: "interview",
      playlist: "industry-solutions",
      engagementScore: 89,
      thumbnail: getYouTubeThumbnail('https://youtu.be/hSAS7rM9pl8'),
      description: "CEOs Calvin Yadav and Mark Lucky discuss the landmark 54,000-camera AI surveillance network deployment in Peru and its strategic implications for Latin American security and regional expansion."
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
      url: "https://youtu.be/iXVQ7pcLbvQ?si=MXe4TXfcUYTy3opD",
      duration: "1:54",
      views: "2.1K",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 88,
      thumbnail: getYouTubeThumbnail('https://youtu.be/iXVQ7pcLbvQ'),
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
      url: "https://youtu.be/0eRj8_nKWj8?si=r5Bv7lvPQA5He590",
      duration: "2:20",
      views: "458",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 83,
      thumbnail: getYouTubeThumbnail('https://youtu.be/0eRj8_nKWj8'),
      description: "See how TruContext serves law enforcement and emergency response teams."
    },
    {
      title: "Logistics, Ports and Supply Chain",
      url: "https://youtu.be/xvLLPZzuEec?si=XwtNdbi6dABk5EVB",
      duration: "2:09",
      views: "1.9K",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 82,
      thumbnail: getYouTubeThumbnail('https://youtu.be/xvLLPZzuEec'),
      description: "TruContext solutions for logistics, port operations, and supply chain security."
    },
  ];

  const filteredVideos = industryVideos.filter(video => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(video.category);
    const matchesPlaylist = !selectedPlaylist || video.playlist === selectedPlaylist;
    return matchesCategory && matchesPlaylist;
  });

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Videos & Webinars</h1>
          <p className="text-xl text-purple-100 max-w-3xl">
            Explore our collection of product demonstrations, industry solutions, webinars, and interviews showcasing the power of TruContext™ platform.
          </p>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-12 bg-white border-b">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Explore by Learning Path</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PLAYLISTS.map(playlist => (
              <button
                key={playlist.id}
                onClick={() => setSelectedPlaylist(selectedPlaylist === playlist.id ? null : playlist.id)}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  selectedPlaylist === playlist.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-yellow-300 bg-yellow-50 hover:border-yellow-400'
                }`}
              >
                <h3 className="font-bold text-lg mb-2">{playlist.label}</h3>
                <p className="text-gray-600">{playlist.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container">
          <h3 className="font-semibold mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedCategories.includes(category.id)
                    ? 'bg-purple-600 text-white'
                    : 'bg-yellow-200 text-gray-900 hover:bg-yellow-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-12">
        <div className="container">
          <p className="text-gray-600 mb-8">Showing {filteredVideos.length} of {industryVideos.length} videos</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {filteredVideos.map((video, index) => (
              <a
                key={index}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-200 aspect-video">
                  {video.thumbnail && (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <Play className="w-16 h-16 text-white fill-white" />
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-sm text-white">
                    {video.duration}
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {video.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {video.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{video.views}★ {video.engagementScore}% engagement</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to See TruContext in Action?</h2>
          <p className="text-xl text-purple-100 mb-8">Schedule a personalized demo with our team</p>
          <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
            Schedule a Demo
          </Button>
        </div>
      </section>
    </div>
  );
}
