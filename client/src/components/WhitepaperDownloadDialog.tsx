import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface WhitepaperDownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WhitepaperDownloadDialog({
  open,
  onOpenChange,
}: WhitepaperDownloadDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const submitLeadMutation = trpc.leads.submitWhitepaperLead.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      // Trigger download after successful submission
      setTimeout(() => {
        handleDownload();
      }, 500);
    },
    onError: (error) => {
      toast.error("Failed to submit form. Please try again.");
      console.error("Lead submission error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.company.trim()) {
      toast.error("Please enter your company name");
      return;
    }

    // Submit lead data
    submitLeadMutation.mutate({
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company.trim(),
      resource: "Architecture Whitepaper",
    });
  };

  const handleDownload = () => {
    setIsDownloading(true);
    
    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = "/TruContext_Architecture_Whitepaper.pdf";
    link.download = "TruContext_Architecture_Whitepaper.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Whitepaper download started!");
    
    // Close dialog after download
    setTimeout(() => {
      setIsDownloading(false);
      onOpenChange(false);
      // Reset form for next time
      setTimeout(() => {
        setFormData({ name: "", email: "", company: "" });
        setIsSubmitted(false);
      }, 300);
    }, 1000);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Download Architecture Whitepaper</DialogTitle>
              <DialogDescription className="text-base pt-2">
                Get instant access to our comprehensive 20-page technical whitepaper covering TruContext's patented Scalable Multi-Layered Graph Database architecture.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Work Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.smith@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  placeholder="Acme Corporation"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={submitLeadMutation.isPending}
                >
                  {submitLeadMutation.isPending ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Whitepaper
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center pt-2">
                By downloading, you agree to receive occasional updates about TruContext. You can unsubscribe at any time.
              </p>
            </form>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <DialogTitle className="text-2xl mb-2">Thank You!</DialogTitle>
            <DialogDescription className="text-base">
              {isDownloading ? (
                "Your whitepaper download is starting..."
              ) : (
                "Your whitepaper has been downloaded successfully. Check your downloads folder."
              )}
            </DialogDescription>
            <p className="text-sm text-muted-foreground mt-4">
              We'll send you occasional updates about TruContext to <strong>{formData.email}</strong>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
