import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface NewsletterSignupProps {
  subscribedTo?: "investor_alerts" | "general_news" | "product_updates";
  title?: string;
  description?: string;
  className?: string;
}

export default function NewsletterSignup({
  subscribedTo = "investor_alerts",
  title = "Stay Informed",
  description = "Subscribe to receive updates",
  className = "",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await subscribeMutation.mutateAsync({
        email,
        name: name || undefined,
        subscribedTo,
      });

      setSubmitted(true);
      toast.success("Successfully subscribed to newsletter!");
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setEmail("");
        setName("");
        setSubmitted(false);
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    }
  };

  if (submitted) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 p-3 bg-green-100 rounded-full">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Thank You for Subscribing!
            </h3>
            <p className="text-gray-600">
              You'll receive updates at {email}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Mail className="h-5 w-5 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="newsletter-name">Name (Optional)</Label>
            <Input
              id="newsletter-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
            />
          </div>
          <div>
            <Label htmlFor="newsletter-email">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={subscribeMutation.isPending || !email}
          >
            {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
          </Button>
          <p className="text-xs text-gray-500 text-center">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
