import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { ArrowLeft, Shield, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function SecurityPage() {
  const [, setLocation] = useLocation();
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [qrCodeData, setQrCodeData] = useState<{ secret: string; qrCode: string } | null>(null);

  const { data: status, refetch } = trpc.twoFactor.status.useQuery();
  const setup2FA = trpc.twoFactor.setup.useMutation();
  const enable2FA = trpc.twoFactor.enable.useMutation();
  const disable2FA = trpc.twoFactor.disable.useMutation();

  const handleSetup = async () => {
    try {
      const result = await setup2FA.mutateAsync();
      setQrCodeData(result);
      setShowSetupDialog(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to setup 2FA");
    }
  };

  const handleEnable = async () => {
    try {
      await enable2FA.mutateAsync({ token: verificationCode });
      toast.success("Two-factor authentication enabled successfully");
      setShowSetupDialog(false);
      setQrCodeData(null);
      setVerificationCode("");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Invalid verification code");
    }
  };

  const handleDisable = async () => {
    try {
      await disable2FA.mutateAsync({ token: verificationCode });
      toast.success("Two-factor authentication disabled");
      setShowDisableDialog(false);
      setVerificationCode("");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Invalid verification code");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/admin")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Security Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account security and authentication
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription className="mt-2">
                  Add an extra layer of security to your account using TOTP authenticator apps
                  like Google Authenticator or Authy.
                </CardDescription>
              </div>
              {status?.enabled ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Enabled</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <X className="h-5 w-5" />
                  <span className="font-medium">Disabled</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {status?.enabled ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    Two-factor authentication is currently enabled on your account. You'll need
                    to enter a verification code from your authenticator app when logging in.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDisableDialog(true)}
                >
                  Disable 2FA
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Two-factor authentication is not enabled. Enable it now to add an extra
                    layer of security to your account.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">How it works:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Scan the QR code with your authenticator app</li>
                    <li>Enter the 6-digit code from the app to verify</li>
                    <li>Use the app to generate codes when logging in</li>
                  </ol>
                </div>
                <Button onClick={handleSetup}>
                  Enable 2FA
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Setup 2FA Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan this QR code with your authenticator app
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {qrCodeData && (
              <>
                <div className="flex justify-center">
                  <img
                    src={qrCodeData.qrCode}
                    alt="2FA QR Code"
                    className="w-64 h-64 border rounded-lg"
                  />
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Manual entry code:</p>
                  <code className="text-sm font-mono break-all">{qrCodeData.secret}</code>
                </div>
              </>
            )}
            <div>
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSetupDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEnable}
              disabled={enable2FA.isPending || verificationCode.length !== 6}
            >
              {enable2FA.isPending ? "Verifying..." : "Enable 2FA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable 2FA Dialog */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Enter your verification code to disable 2FA
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                Warning: Disabling 2FA will make your account less secure.
              </p>
            </div>
            <div>
              <Label htmlFor="disable-code">Verification Code</Label>
              <Input
                id="disable-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisableDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisable}
              disabled={disable2FA.isPending || verificationCode.length !== 6}
            >
              {disable2FA.isPending ? "Disabling..." : "Disable 2FA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
