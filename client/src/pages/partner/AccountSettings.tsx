import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Lock, LogOut, LogIn, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function AccountSettings() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"password" | "logout">("password");
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Password reset state
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState(user?.email || "");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  const requestPasswordReset = trpc.partner.requestPasswordReset.useMutation();

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetMessage("");

    try {
      await requestPasswordReset.mutateAsync({ email: resetEmail });
      setResetMessage("Password reset link has been sent to your email. Please check your inbox.");
      setShowPasswordReset(false);
      setResetEmail("");
    } catch (error: any) {
      setResetError(error.message || "Failed to request password reset. Please try again.");
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Not Logged In</CardTitle>
              <CardDescription>You need to log in to access account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLogin} className="w-full bg-primary hover:bg-primary/90">
                <LogIn className="h-4 w-4 mr-2" />
                Log In to Your Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Settings</h1>

        {/* Account Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your current account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <p className="mt-1 text-gray-900">{user?.email}</p>
              </div>
              {user?.name && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-gray-900">{user.name}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Password Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Password Management
            </CardTitle>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            {resetMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">Success</p>
                  <p className="text-sm text-green-800 mt-1">{resetMessage}</p>
                </div>
              </div>
            )}

            {resetError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-sm text-red-800 mt-1">{resetError}</p>
                </div>
              </div>
            )}

            {showPasswordReset ? (
              <form onSubmit={handlePasswordResetRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={requestPasswordReset.isPending}
                    className="flex-1"
                  >
                    {requestPasswordReset.isPending ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPasswordReset(false);
                      setResetEmail(user?.email || "");
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Forgot your password? We can send you a link to reset it.
                </p>
                <Button
                  onClick={() => setShowPasswordReset(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Request Password Reset
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logout Section */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Log Out
            </CardTitle>
            <CardDescription className="text-red-800">
              End your current session and log out of your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logoutConfirm ? (
              <div className="space-y-4">
                <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-sm font-semibold text-red-900 mb-2">Are you sure?</p>
                  <p className="text-sm text-red-800">
                    You'll need to log back in to access your partner account. Your data will be safe.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isLoggingOut ? "Logging out..." : "Yes, Log Out"}
                  </Button>
                  <Button
                    onClick={() => setLogoutConfirm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setLogoutConfirm(true)}
                variant="destructive"
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out of Your Account
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Login Info */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Need to Log Back In?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800 mb-4">
              After logging out, you can log back in anytime using your email address and password.
            </p>
            <Button onClick={handleLogin} variant="outline" className="w-full">
              <LogIn className="h-4 w-4 mr-2" />
              Log In Again
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
