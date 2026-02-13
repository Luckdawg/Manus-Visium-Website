import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function PartnerLogin() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoverySubmitted, setRecoverySubmitted] = useState(false);
  const [recoveryError, setRecoveryError] = useState("");
  const [showRecovery, setShowRecovery] = useState(false);

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");

    if (!recoveryEmail) {
      setRecoveryError("Please enter your email address");
      return;
    }

    try {
      const recoveryMutation = trpc.partner.requestPasswordReset.useMutation();
      const result = await recoveryMutation.mutateAsync({ email: recoveryEmail });
      
      if (result.success) {
        setRecoverySubmitted(true);
        setRecoveryEmail("");
        setTimeout(() => {
          setRecoverySubmitted(false);
          setShowRecovery(false);
        }, 5000);
      }
    } catch (error) {
      setRecoveryError("Failed to send recovery email. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back!</CardTitle>
            <CardDescription>You are already logged in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-900">Account Active</p>
                <p className="text-sm text-green-700 mt-1">
                  Your partner account is active and ready to use.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Role:</strong> {user.role}
              </p>
            </div>

            <Button
              onClick={() => (window.location.href = "/partners/dashboard")}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Go to Partner Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Partner Portal Login</CardTitle>
          <CardDescription>Access your partner account and manage deals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showRecovery ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">New to the Partner Portal?</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Click the button below to sign in with your Visium account.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember-me"
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="text-sm text-slate-600">
                  Keep me logged in for 30 days
                </label>
              </div>

              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="w-full bg-primary hover:bg-primary/90 text-white h-10"
              >
                Sign In with Visium Account
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Or</span>
                </div>
              </div>

              <button
                onClick={() => setShowRecovery(true)}
                className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium"
              >
                Can't access your account?
              </button>

              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  First Time?
                </p>
                <p className="text-sm text-slate-600">
                  If you're a new partner, you'll need to complete the onboarding wizard after signing in.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Enter your email address and we'll send you instructions to recover your account.
                </p>

                {recoverySubmitted && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Email Sent</p>
                      <p className="text-sm text-green-700 mt-1">
                        Check your email for recovery instructions.
                      </p>
                    </div>
                  </div>
                )}

                {recoveryError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Error</p>
                      <p className="text-sm text-red-700 mt-1">{recoveryError}</p>
                    </div>
                  </div>
                )}

                {!recoverySubmitted && (
                  <form onSubmit={handleRecoverySubmit} className="space-y-4">
                    <div>
                      <label htmlFor="recovery-email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <Input
                        id="recovery-email"
                        type="email"
                        placeholder="your@company.com"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Recovery Email
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowRecovery(false)}
                      >
                        Back
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </>
          )}

          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Need help? Contact{" "}
              <a href="mailto:partners@visiumtech.com" className="text-primary hover:underline">
                partners@visiumtech.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
