import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Shield, Users, FileText, Image, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { data: currentUser, isLoading } = trpc.admin.getCurrentUser.useQuery();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      // Redirect to login if not authenticated
      setLocation("/admin/login");
    }
  }, [currentUser, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  // Check if user has admin access
  const hasAdminAccess = ["super_admin", "admin", "editor"].includes(currentUser.role);

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {currentUser.name || currentUser.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {currentUser.role.replace("_", " ")}
              </p>
            </div>
            <Button variant="outline" onClick={() => setLocation("/")}>
              Back to Site
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Management */}
          {["super_admin", "admin"].includes(currentUser.role) && (
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/admin/users")}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Users className="h-8 w-8 text-primary" />
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage admin users, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Content Management */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/admin/content")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>
                Edit website pages and content sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Edit Content
              </Button>
            </CardContent>
          </Card>

          {/* Media Library */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/admin/media")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Image className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>
                Upload and manage images and files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Media
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/admin/security")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Shield className="h-8 w-8 text-primary" />
                {currentUser.twoFactorEnabled && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    2FA Enabled
                  </span>
                )}
              </div>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure 2FA and security options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Security Settings
              </Button>
            </CardContent>
          </Card>

          {/* Audit Logs */}
          {["super_admin", "admin"].includes(currentUser.role) && (
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/admin/audit")}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>
                  View system activity and changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Logs
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Your Role</CardDescription>
                <CardTitle className="text-2xl capitalize">
                  {currentUser.role.replace("_", " ")}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Two-Factor Auth</CardDescription>
                <CardTitle className="text-2xl">
                  {currentUser.twoFactorEnabled ? "Enabled" : "Disabled"}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Account Status</CardDescription>
                <CardTitle className="text-2xl text-green-600">Active</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
