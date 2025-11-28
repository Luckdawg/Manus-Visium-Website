import { useEffect } from "react";

interface TwitterFeedProps {
  username: string;
  height?: number;
}

export default function TwitterFeed({ username, height = 600 }: TwitterFeedProps) {
  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="twitter-feed-container">
      <a
        className="twitter-timeline"
        data-height={height}
        data-theme="light"
        data-chrome="noheader nofooter noborders"
        href={`https://twitter.com/${username}?ref_src=twsrc%5Etfw`}
      >
        Loading posts from @{username}...
      </a>
    </div>
  );
}
