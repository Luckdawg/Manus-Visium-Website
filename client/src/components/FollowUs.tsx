import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Linkedin, Youtube, Instagram } from "lucide-react";

export default function FollowUs() {
  return (
    <section className="py-12 bg-white">
      <div className="container">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Follow Us</h2>
            <p className="text-gray-600 mb-6 text-center">
              Stay connected with Visium Technologies on social media for company updates, career opportunities, and industry insights
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-800 hover:bg-gray-800 hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                onClick={() => window.open('https://x.com/VisiumAnalytics', '_blank')}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 hover:bg-blue-600 hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                onClick={() => window.open('https://www.linkedin.com/company/visium-technologies-inc', '_blank')}
              >
                <Linkedin className="h-5 w-5 mr-2" />
                LinkedIn
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                onClick={() => window.open('https://www.facebook.com/VisiumTech', '_blank')}
              >
                <Facebook className="h-5 w-5 mr-2" />
                Facebook
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-red-600 hover:bg-red-600 hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                onClick={() => window.open('https://www.youtube.com/@visiumanalytics874', '_blank')}
              >
                <Youtube className="h-5 w-5 mr-2" />
                YouTube
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-pink-600 hover:bg-pink-600 hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                onClick={() => window.open('https://www.instagram.com/visiumtech/', '_blank')}
              >
                <Instagram className="h-5 w-5 mr-2" />
                Instagram
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
