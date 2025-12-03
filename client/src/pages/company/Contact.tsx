import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { Mail, Phone, MapPin, Facebook, Linkedin, Youtube, Instagram } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link with form data
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n\n` +
      `Message:\n${formData.message}`
    );
    
    window.location.href = `mailto:info@visiumtechnologies.com?subject=${subject}&body=${body}`;
    
    toast.success("Thank you! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <section className="gradient-hero py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-xl text-gray-600">
              Get in touch with our team to learn more about TruContext
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Email</h3>
                <p className="text-gray-600">info@visiumtechnologies.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Phone</h3>
                <p className="text-gray-600">+1 (703) 273-0383</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Location</h3>
                <p className="text-gray-600">United States</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left Column - Follow Us Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Follow Us</h2>
                  <p className="text-gray-600 mb-6">
                    Stay connected with Visium Technologies on social media for company updates, career opportunities, and industry insights
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-300 w-full justify-start"
                      onClick={() => window.open('https://x.com/VisiumAnalytics', '_blank')}
                    >
                      <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      X (Twitter)
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 w-full justify-start"
                      onClick={() => window.open('https://www.linkedin.com/company/visium-technologies-inc', '_blank')}
                    >
                      <Linkedin className="h-5 w-5 mr-3" />
                      LinkedIn
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 w-full justify-start"
                      onClick={() => window.open('https://www.facebook.com/VisiumTech', '_blank')}
                    >
                      <Facebook className="h-5 w-5 mr-3" />
                      Facebook
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 w-full justify-start"
                      onClick={() => window.open('https://www.youtube.com/@visiumanalytics874', '_blank')}
                    >
                      <Youtube className="h-5 w-5 mr-3" />
                      YouTube
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-pink-600 hover:bg-pink-600 hover:text-white transition-all duration-300 w-full justify-start"
                      onClick={() => window.open('https://www.instagram.com/visiumtech/', '_blank')}
                    >
                      <Instagram className="h-5 w-5 mr-3" />
                      Instagram
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Name *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Email *
                    </label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Subject *
                    </label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Message *
                    </label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
