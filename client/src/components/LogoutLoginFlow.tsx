import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, LogOut, LogIn } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function LogoutLoginFlow() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // Redirect to home after logout
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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Not Logged In</CardTitle>
          <CardDescription>You need to log in to access this page</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} className="w-full bg-primary hover:bg-primary/90">
            <LogIn className="h-4 w-4 mr-2" />
            Log In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
            {user?.name && (
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{user.name}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logout Confirmation */}
      {logoutConfirm && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Confirm Logout</CardTitle>
            <CardDescription className="text-red-800">
              Are you sure you want to log out? You'll need to log back in to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
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
          </CardContent>
        </Card>
      )}

      {/* Logout Button */}
      {!logoutConfirm && (
        <Button
          onClick={() => setLogoutConfirm(true)}
          variant="destructive"
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      )}

      {/* Re-login Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <CardTitle className="text-blue-900">Need to Log Back In?</CardTitle>
              <CardDescription className="text-blue-800 mt-2">
                After logging out, you can log back in anytime using your email address and password.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} variant="outline" className="w-full">
            <LogIn className="h-4 w-4 mr-2" />
            Log In Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
