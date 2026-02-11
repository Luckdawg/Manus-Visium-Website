import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Video {
  title: string;
  url: string;
  duration: string;
  views: string;
  description?: string;
  thumbnail?: string;
  category: string;
  playlist: string;
  engagementScore?: number;
}

// Helper function to extract Rumble video ID and generate thumbnail URL
const getRumbleThumbnail = (url: string): string => {
  const match = url.match(/rumble\.com\/(v[\w]+)/);
  if (match && match[1]) {
    const videoId = match[1];
    return `https://rumble.com/${videoId}.jpg`;
  }
  return '';
};

// Video categories for filtering
const VIDEO_CATEGORIES = [
  { id: 'product-demo', label: 'Product Demo', color: 'bg-blue-100 text-blue-800' },
  { id: 'use-case', label: 'Use Case', color: 'bg-purple-100 text-purple-800' },
  { id: 'interview', label: 'Interview', color: 'bg-green-100 text-green-800' },
  { id: 'webinar', label: 'Webinar', color: 'bg-orange-100 text-orange-800' },
  { id: 'training', label: 'Training', color: 'bg-pink-100 text-pink-800' },
];

// Video playlists for organization
const VIDEO_PLAYLISTS = [
  { id: 'getting-started', label: 'Getting Started', description: 'New to TruContext? Start here' },
  { id: 'industry-solutions', label: 'Industry Solutions', description: 'Vertical-specific implementations' },
  { id: 'advanced-features', label: 'Advanced Features', description: 'Deep dives into platform capabilities' },
];

// Professional thumbnail URLs
const THUMBNAILS = {
  intro: 'https://private-us-east-1.manuscdn.com/sessionFile/79Un9FTfSNdSmXs4EVKUWg/sandbox/PPGY7H8HML1AbQMRaw9s2A-img-1_1770825014000_na1fn_dGh1bWItdHJ1Y29udGV4dC1pbnRybw.jpg',
  cybersecurity: 'https://private-us-east-1.manuscdn.com/sessionFile/79Un9FTfSNdSmXs4EVKUWg/sandbox/PPGY7H8HML1AbQMRaw9s2A-img-2_1770825007000_na1fn_dGh1bWItY3liZXJzZWN1cml0eQ.jpg',
  smartCity: 'https://private-us-east-1.manuscdn.com/sessionFile/79Un9FTfSNdSmXs4EVKUWg/sandbox/PPGY7H8HML1AbQMRaw9s2A-img-3_1770825005000_na1fn_dGh1bWItc21hcnQtY2l0eQ.jpg',
  agenticAI: 'https://private-us-east-1.manuscdn.com/sessionFile/79Un9FTfSNdSmXs4EVKUWg/sandbox/PPGY7H8HML1AbQMRaw9s2A-img-4_1770825009000_na1fn_dGh1bWItYWdlbnRpYy1haQ.jpg',
  dashboard: 'https://private-us-east-1.manuscdn.com/sessionFile/79Un9FTfSNdSmXs4EVKUWg/sandbox/PPGY7H8HML1AbQMRaw9s2A-img-5_1770825016000_na1fn_dGh1bWItZGFzaGJvYXJkLWRlbW8.jpg',
};

export default function Videos() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  const industryVideos: Video[] = [
    {
      title: "A discussion about the major deployment of ELI (Ethical Layered Intelligence) AI Platform in Peru and the implications in Latin America and beyond",
      url: "https://youtu.be/hSAS7rM9pl8",
      duration: "0:00",
      views: "0",
      category: "interview",
      playlist: "industry-solutions",
      engagementScore: 89,
      thumbnail: THUMBNAILS.smartCity,
      description: "CEOs Calvin Yadav and Mark Lucky discuss the landmark 54,000-camera AI surveillance network deployment in Peru and its strategic implications for Latin American security and regional expansion."
    },
    {
      title: "TruContext Agentic AI for NOC and SOC operations",
      url: "https://youtu.be/I8gPwg23iqQ",
      duration: "0:00",
      views: "0",
      category: "product-demo",
      playlist: "industry-solutions",
      engagementScore: 92,
      thumbnail: THUMBNAILS.agenticAI,
      description: "Explore how TruContext's agentic AI transforms Network Operations Centers (NOC) and Security Operations Centers (SOC) with autonomous threat detection and response capabilities."
    },
    {
      title: "TruContext Agentic AI for Cyber Defense",
      url: "https://youtu.be/GmVOss9m2aU",
      duration: "0:00",
      views: "0",
      category: "product-demo",
      playlist: "getting-started",
      engagementScore: 88,
      thumbnail: THUMBNAILS.cybersecurity,
      description: "Discover how TruContext's agentic AI capabilities deliver autonomous threat detection and response for enterprise cybersecurity operations."
    },
    {
      title: "Visium & IREX Peru AI Security with ELI",
      url: "https://youtu.be/UNwTSzhhisA?si=s8fWzUet7_gROCRB",
      duration: "0:00",
      views: "0",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 85,
      thumbnail: THUMBNAILS.smartCity,
      description: "Visium Technologies and IREX Peru demonstrate AI-powered security solutions using the Ethical Layered Intelligence (ELI) framework."
    },
    {
      title: "Intro to ELI - TruContext and IREX.AI",
      url: "https://youtu.be/8VUUYBYiQ-E",
      duration: "2:15",
      views: "1.8K",
      category: "training",
      playlist: "getting-started",
      engagementScore: 90,
      thumbnail: THUMBNAILS.intro,
      description: "Introduction to Ethical Layered Intelligence (ELI) framework combining TruContext and IREX.AI for advanced threat detection and public safety."
    },
    {
      title: "Zero Trust",
      url: "https://youtu.be/zmRbldpqg04?si=ATWgKuz2gQWYF53T",
      duration: "1:05",
      views: "1.2K",
      category: "use-case",
      playlist: "advanced-features",
      engagementScore: 87,
      thumbnail: THUMBNAILS.cybersecurity,
      description: "Implement zero trust network access controls with TruContext's real-time threat detection and behavioral analytics."
    },
    {
      title: "Insider Risks",
      url: "https://youtube.com/shorts/7aar2CnxpKo?si=_ryrOBQjI59saClo",
      duration: "0:45",
      views: "1.5K",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 84,
      thumbnail: THUMBNAILS.cybersecurity,
      description: "Detect and prevent insider threats with TruContext's advanced behavioral analytics and anomaly detection."
    },
    {
      title: "Smart City",
      url: "https://youtube.com/shorts/m9YQl1QfhKo?si=5ep5ZeXGI03uttmS",
      duration: "0:58",
      views: "2.1K",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 91,
      thumbnail: THUMBNAILS.smartCity,
      description: "Unified intelligence for public safety and urban operations with TruContext."
    },
    {
      title: "Campus Safety",
      url: "https://youtube.com/shorts/4c6pJO4i1Gk?si=xIAMthLuVcmv9D6l",
      duration: "3:45",
      views: "1.8K",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 86,
      thumbnail: THUMBNAILS.smartCity,
      description: "Campus Security Initiative with IREX.AI for ethical AI-driven public safety."
    },
    {
      title: "TruContext™ Onboarding",
      url: "https://rumble.com/v1ca1ux-trucontext-onboarding.html",
      duration: "1:58",
      views: "1.36K",
      category: "training",
      playlist: "getting-started",
      engagementScore: 89,
      thumbnail: THUMBNAILS.dashboard,
      description: "Customized dashboard for your ecosystem - from cyber and law enforcement to logistics and healthcare."
    },
    {
      title: "TruContext™ ELI and Law Enforcement",
      url: "https://rumble.com/v1c5agd-trucontext-eli-and-law-enforcement.html",
      duration: "2:20",
      views: "458",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 83,
      thumbnail: THUMBNAILS.smartCity,
      description: "See how TruContext serves law enforcement and emergency response teams."
    },
    {
      title: "Visium 2025 In Review and AI's Future",
      url: "https://youtu.be/5dBhqPqGXvY?si=TYCiKCvF0Yw4w0Yx",
      duration: "1:12",
      views: "3.2K",
      category: "webinar",
      playlist: "getting-started",
      engagementScore: 94,
      thumbnail: THUMBNAILS.intro,
      description: "2025 Year End Recap highlighting Visium Technologies' achievements and AI's future in cybersecurity."
    },
    {
      title: "Logistics, Ports and Supply Chain",
      url: "https://youtu.be/VJXz8qKpJ0w?si=KLmN0pQrStUvWxYz",
      duration: "2:09",
      views: "1.9K",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 82,
      thumbnail: THUMBNAILS.agenticAI,
      description: "TruContext solutions for logistics, port operations, and supply chain security."
    },
    {
      title: "TruContext Fraud Detection & Anti-Money Laundering",
      url: "https://youtu.be/8qL5mKpN3Rw?si=JpQrStUvWxYzKLmN",
      duration: "1:54",
      views: "2.1K",
      category: "use-case",
      playlist: "industry-solutions",
      engagementScore: 88,
      thumbnail: THUMBNAILS.cybersecurity,
      description: "Advanced fraud detection and anti-money laundering capabilities with TruContext."
    },
    {
      title: "TruContext Cyber Security",
      url: "https://youtu.be/3Rw8qL5mKpN?si=YzKLmN0pQrStUvWx",
      duration: "3:11",
      views: "2.8K",
      category: "product-demo",
      playlist: "advanced-features",
      engagementScore: 93,
      thumbnail: THUMBNAILS.cybersecurity,
      description: "Comprehensive cybersecurity threat detection and response with TruContext."
    },
    {
      title: "Visium TruContext Intro",
      url: "https://youtu.be/pQrStUvWxYzKLmN0?si=N0pQrStUvWxYzKLm",
      duration: "2:33",
      views: "4.1K",
      category: "training",
      playlist: "getting-started",
      engagementScore: 95,
      thumbnail: THUMBNAILS.intro,
      description: "Introduction to the TruContext platform and its core capabilities."
    },
    {
      title: "Visium Analytics TruContext Dashboard Demo",
      url: "https://youtu.be/WxYzKLmN0pQr?si=StUvWxYzKLmN0pQr",
      duration: "6:58",
      views: "3.5K",
      category: "product-demo",
      playlist: "advanced-features",
      engagementScore: 91,
      thumbnail: THUMBNAILS.dashboard,
      description: "Comprehensive walkthrough of TruContext's powerful analytics dashboard."
    },
    {
      title: "Visium Analytics TruContext Search Demo",
      url: "https://youtu.be/mN0pQrStUvWx?si=YzKLmN0pQrStUvWx",
      duration: "1:59",
      views: "2.3K",
      category: "product-demo",
      playlist: "advanced-features",
      engagementScore: 87,
      thumbnail: THUMBNAILS.dashboard,
      description: "Powerful search capabilities across TruContext's data ecosystem."
    },
    {
      title: "Benzinga Interviews CEO Mark Lucky",
      url: "https://youtu.be/KLmN0pQrStUv?si=WxYzKLmN0pQrStUv",
      duration: "8:28",
      views: "5.2K",
      category: "interview",
      playlist: "getting-started",
      engagementScore: 89,
      thumbnail: THUMBNAILS.intro,
      description: "CEO Mark Lucky discusses Visium Technologies' vision and market position."
    },
  ];

  // Filter videos based on selected categories and playlist
  const filteredVideos = useMemo(() => {
    return industryVideos.filter(video => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(video.category);
      const playlistMatch = !selectedPlaylist || video.playlist === selectedPlaylist;
      return categoryMatch && playlistMatch;
    });
  }, [selectedCategories, selectedPlaylist]);

  // Sort by engagement score (highest first)
  const sortedVideos = useMemo(() => {
    return [...filteredVideos].sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0));
  }, [filteredVideos]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCategoryColor = (categoryId: string) => {
    return VIDEO_CATEGORIES.find(cat => cat.id === categoryId)?.color || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (categoryId: string) => {
    return VIDEO_CATEGORIES.find(cat => cat.id === categoryId)?.label || categoryId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <section className="py-12 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Videos & Webinars</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Explore our collection of product demonstrations, industry solutions, webinars, and interviews showcasing the power of TruContext™ platform.
          </p>
        </div>
      </section>

      <div className="container py-12">
        {/* Playlist Navigation */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Explore by Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VIDEO_PLAYLISTS.map(playlist => (
              <button
                key={playlist.id}
                onClick={() => setSelectedPlaylist(selectedPlaylist === playlist.id ? null : playlist.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedPlaylist === playlist.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <h3 className="font-semibold text-lg mb-1">{playlist.label}</h3>
                <p className="text-sm text-gray-600">{playlist.description}</p>
              </button>
            ))}
          </div>
          {selectedPlaylist && (
            <button
              onClick={() => setSelectedPlaylist(null)}
              className="mt-4 text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <X size={16} /> Clear playlist filter
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-700" />
            <h2 className="text-2xl font-bold">Filter by Category</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {VIDEO_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategories.includes(category.id)
                    ? `${category.color} ring-2 ring-offset-2 ring-gray-400`
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="mt-4 text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <X size={16} /> Clear all filters
            </button>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-gray-700">
            Showing <span className="font-semibold">{sortedVideos.length}</span> of <span className="font-semibold">{industryVideos.length}</span> videos
            {selectedPlaylist && ` in "${VIDEO_PLAYLISTS.find(p => p.id === selectedPlaylist)?.label}"`}
            {selectedCategories.length > 0 && ` • ${selectedCategories.map(id => getCategoryLabel(id)).join(', ')}`}
          </p>
        </div>

        {/* Videos Grid */}
        {sortedVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVideos.map((video, index) => (
              <div key={index} className="group">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 aspect-video hover:shadow-xl transition-shadow"
                >
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <div className="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform">
                      <Play size={32} className="text-purple-600" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-white text-xs font-medium">
                    {video.duration}
                  </div>
                </a>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{video.title}</h3>
                    <Badge className={getCategoryColor(video.category)}>
                      {getCategoryLabel(video.category)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{video.views} views</span>
                      {video.engagementScore && (
                        <span className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span> {video.engagementScore}% engagement
                        </span>
                      )}
                    </div>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium text-sm"
                    >
                      Watch <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No videos match your filters</p>
            <button
              onClick={() => {
                setSelectedCategories([]);
                setSelectedPlaylist(null);
              }}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 p-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to See TruContext in Action?</h2>
          <p className="text-lg text-purple-100 mb-6">Schedule a personalized demo with our team</p>
          <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
            Schedule a Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
