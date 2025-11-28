import { useEffect } from "react";

interface LinkedInFeedProps {
  companyId: string;
  height?: number;
}

export default function LinkedInFeed({ companyId, height = 600 }: LinkedInFeedProps) {
  useEffect(() => {
    // Load LinkedIn embed script
    const script = document.createElement("script");
    script.src = "https://platform.linkedin.com/in.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = 'lang: en_US';
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://platform.linkedin.com/in.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="linkedin-feed-container" style={{ height: `${height}px`, overflow: "auto" }}>
      <script
        type="IN/CompanyProfile"
        data-id={companyId}
        data-format="inline"
        data-related="false"
      ></script>
      <div className="text-center text-gray-500 py-8">
        <p>Loading LinkedIn updates...</p>
        <p className="text-sm mt-2">
          <a 
            href={`https://www.linkedin.com/company/${companyId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            View on LinkedIn →
          </a>
        </p>
      </div>
    </div>
  );
}
