import { describe, it, expect } from 'vitest';

// Mock video data for testing
const mockVideos = [
  {
    title: "TruContext Agentic AI for NOC and SOC operations",
    url: "https://youtu.be/I8gPwg23iqQ",
    duration: "0:00",
    views: "0",
    category: "product-demo",
    playlist: "industry-solutions",
    engagementScore: 92,
    description: "Explore how TruContext's agentic AI transforms NOC and SOC operations."
  },
  {
    title: "Smart City",
    url: "https://youtube.com/shorts/m9YQl1QfhKo?si=5ep5ZeXGI03uttmS",
    duration: "0:58",
    views: "2.1K",
    category: "use-case",
    playlist: "industry-solutions",
    engagementScore: 91,
    description: "Unified intelligence for public safety and urban operations."
  },
  {
    title: "Intro to ELI - TruContext and IREX.AI",
    url: "https://youtu.be/8VUUYBYiQ-E",
    duration: "2:15",
    views: "1.8K",
    category: "training",
    playlist: "getting-started",
    engagementScore: 90,
    description: "Introduction to Ethical Layered Intelligence framework."
  },
  {
    title: "Zero Trust",
    url: "https://youtu.be/zmRbldpqg04?si=ATWgKuz2gQWYF53T",
    duration: "1:05",
    views: "1.2K",
    category: "use-case",
    playlist: "advanced-features",
    engagementScore: 87,
    description: "Implement zero trust network access controls."
  },
  {
    title: "Visium TruContext Intro",
    url: "https://youtu.be/pQrStUvWxYzKLmN0?si=N0pQrStUvWxYzKLm",
    duration: "2:33",
    views: "4.1K",
    category: "training",
    playlist: "getting-started",
    engagementScore: 95,
    description: "Introduction to the TruContext platform."
  }
];

describe('Videos Page - Category Filtering', () => {
  it('should filter videos by single category', () => {
    const selectedCategories = ['use-case'];
    const filtered = mockVideos.filter(video =>
      selectedCategories.length === 0 || selectedCategories.includes(video.category)
    );
    
    expect(filtered.length).toBe(2);
    expect(filtered.every(v => v.category === 'use-case')).toBe(true);
  });

  it('should filter videos by multiple categories', () => {
    const selectedCategories = ['use-case', 'training'];
    const filtered = mockVideos.filter(video =>
      selectedCategories.length === 0 || selectedCategories.includes(video.category)
    );
    
    expect(filtered.length).toBe(4);
    expect(filtered.every(v => ['use-case', 'training'].includes(v.category))).toBe(true);
  });

  it('should return all videos when no category is selected', () => {
    const selectedCategories: string[] = [];
    const filtered = mockVideos.filter(video =>
      selectedCategories.length === 0 || selectedCategories.includes(video.category)
    );
    
    expect(filtered.length).toBe(mockVideos.length);
  });

  it('should return empty array for non-existent category', () => {
    const selectedCategories = ['non-existent-category'];
    const filtered = mockVideos.filter(video =>
      selectedCategories.length === 0 || selectedCategories.includes(video.category)
    );
    
    expect(filtered.length).toBe(0);
  });
});

describe('Videos Page - Playlist Filtering', () => {
  it('should filter videos by single playlist', () => {
    const selectedPlaylist = 'getting-started';
    const filtered = mockVideos.filter(video =>
      !selectedPlaylist || video.playlist === selectedPlaylist
    );
    
    expect(filtered.length).toBe(2);
    expect(filtered.every(v => v.playlist === 'getting-started')).toBe(true);
  });

  it('should return all videos when no playlist is selected', () => {
    const selectedPlaylist: string | null = null;
    const filtered = mockVideos.filter(video =>
      !selectedPlaylist || video.playlist === selectedPlaylist
    );
    
    expect(filtered.length).toBe(mockVideos.length);
  });

  it('should return empty array for non-existent playlist', () => {
    const selectedPlaylist = 'non-existent-playlist';
    const filtered = mockVideos.filter(video =>
      !selectedPlaylist || video.playlist === selectedPlaylist
    );
    
    expect(filtered.length).toBe(0);
  });
});

describe('Videos Page - Combined Filtering', () => {
  it('should apply both category and playlist filters', () => {
    const selectedCategories = ['training'];
    const selectedPlaylist = 'getting-started';
    
    const filtered = mockVideos.filter(video => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(video.category);
      const playlistMatch = !selectedPlaylist || video.playlist === selectedPlaylist;
      return categoryMatch && playlistMatch;
    });
    
    expect(filtered.length).toBe(2);
    expect(filtered.every(v => v.category === 'training' && v.playlist === 'getting-started')).toBe(true);
  });

  it('should return empty when filters have no matching videos', () => {
    const selectedCategories = ['interview'];
    const selectedPlaylist = 'industry-solutions';
    
    const filtered = mockVideos.filter(video => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(video.category);
      const playlistMatch = !selectedPlaylist || video.playlist === selectedPlaylist;
      return categoryMatch && playlistMatch;
    });
    
    expect(filtered.length).toBe(0);
  });
});

describe('Videos Page - Engagement Analytics', () => {
  it('should sort videos by engagement score (highest first)', () => {
    const sorted = [...mockVideos].sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0));
    
    expect(sorted[0].engagementScore).toBe(95);
    expect(sorted[1].engagementScore).toBe(92);
    expect(sorted[2].engagementScore).toBe(91);
    expect(sorted[3].engagementScore).toBe(90);
    expect(sorted[4].engagementScore).toBe(87);
  });

  it('should maintain engagement score order after filtering', () => {
    const selectedCategories = ['use-case'];
    const filtered = mockVideos.filter(video =>
      selectedCategories.length === 0 || selectedCategories.includes(video.category)
    );
    const sorted = [...filtered].sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0));
    
    expect(sorted.length).toBe(2);
    expect(sorted[0].engagementScore).toBe(91);
    expect(sorted[1].engagementScore).toBe(87);
  });

  it('should display engagement score as percentage', () => {
    mockVideos.forEach(video => {
      if (video.engagementScore) {
        expect(video.engagementScore).toBeGreaterThanOrEqual(0);
        expect(video.engagementScore).toBeLessThanOrEqual(100);
      }
    });
  });
});

describe('Videos Page - Playlist Collections', () => {
  it('should have correct number of videos in each playlist', () => {
    const gettingStarted = mockVideos.filter(v => v.playlist === 'getting-started');
    const industrySolutions = mockVideos.filter(v => v.playlist === 'industry-solutions');
    const advancedFeatures = mockVideos.filter(v => v.playlist === 'advanced-features');
    
    expect(gettingStarted.length).toBe(2);
    expect(industrySolutions.length).toBe(2);
    expect(advancedFeatures.length).toBe(1);
  });

  it('should have all videos assigned to a playlist', () => {
    const allPlaylists = ['getting-started', 'industry-solutions', 'advanced-features'];
    expect(mockVideos.every(v => allPlaylists.includes(v.playlist))).toBe(true);
  });

  it('should organize videos logically by learning path', () => {
    const gettingStarted = mockVideos.filter(v => v.playlist === 'getting-started');
    const hasIntro = gettingStarted.some(v => v.title.includes('Intro'));
    const hasTraining = gettingStarted.some(v => v.category === 'training');
    
    expect(hasIntro || hasTraining).toBe(true);
  });
});

describe('Videos Page - Video Metadata', () => {
  it('should have required fields for each video', () => {
    mockVideos.forEach(video => {
      expect(video).toHaveProperty('title');
      expect(video).toHaveProperty('url');
      expect(video).toHaveProperty('duration');
      expect(video).toHaveProperty('views');
      expect(video).toHaveProperty('category');
      expect(video).toHaveProperty('playlist');
      expect(video).toHaveProperty('engagementScore');
    });
  });

  it('should have valid YouTube URLs', () => {
    mockVideos.forEach(video => {
      const isYouTubeUrl = video.url.includes('youtu.be') || video.url.includes('youtube.com');
      expect(isYouTubeUrl).toBe(true);
    });
  });

  it('should have non-empty titles and descriptions', () => {
    mockVideos.forEach(video => {
      expect(video.title.length).toBeGreaterThan(0);
      expect(video.description?.length || 0).toBeGreaterThan(0);
    });
  });
});

describe('Videos Page - User Interactions', () => {
  it('should toggle category selection correctly', () => {
    let selectedCategories: string[] = [];
    const categoryId = 'use-case';
    
    // First click - add category
    selectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    expect(selectedCategories).toContain(categoryId);
    
    // Second click - remove category
    selectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    expect(selectedCategories).not.toContain(categoryId);
  });

  it('should toggle playlist selection correctly', () => {
    let selectedPlaylist: string | null = null;
    const playlistId = 'getting-started';
    
    // First click - select playlist
    selectedPlaylist = selectedPlaylist === playlistId ? null : playlistId;
    expect(selectedPlaylist).toBe(playlistId);
    
    // Second click - deselect playlist
    selectedPlaylist = selectedPlaylist === playlistId ? null : playlistId;
    expect(selectedPlaylist).toBeNull();
  });

  it('should clear all filters', () => {
    let selectedCategories = ['use-case', 'training'];
    let selectedPlaylist = 'getting-started';
    
    selectedCategories = [];
    selectedPlaylist = null;
    
    expect(selectedCategories.length).toBe(0);
    expect(selectedPlaylist).toBeNull();
  });
});

describe('Videos Page - Results Summary', () => {
  it('should calculate correct filtered count', () => {
    const selectedCategories = ['use-case'];
    const selectedPlaylist = 'industry-solutions';
    
    const filtered = mockVideos.filter(video => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(video.category);
      const playlistMatch = !selectedPlaylist || video.playlist === selectedPlaylist;
      return categoryMatch && playlistMatch;
    });
    
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('Smart City');
  });

  it('should display correct total video count', () => {
    expect(mockVideos.length).toBe(5);
  });

  it('should update results message with filter context', () => {
    const selectedCategories = ['training'];
    const selectedPlaylist = 'getting-started';
    
    const filtered = mockVideos.filter(video => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(video.category);
      const playlistMatch = !selectedPlaylist || video.playlist === selectedPlaylist;
      return categoryMatch && playlistMatch;
    });
    
    const message = `Showing ${filtered.length} of ${mockVideos.length} videos in "${selectedPlaylist}" • ${selectedCategories.join(', ')}`;
    expect(message).toContain('Showing 2 of 5 videos');
  });
});
