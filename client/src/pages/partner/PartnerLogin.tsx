
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl, APP_TITLE, APP_LOGO } from "@/const";
import { LogIn, ArrowRight } from "lucide-react";

export default function PartnerLogin() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          {APP_LOGO && (
            <img src={APP_LOGO} alt="Logo" className="h-12 mx-auto mb-4" />
          )}
          <CardTitle className="text-2xl">{APP_TITLE} Partner Portal</CardTitle>
          <CardDescription>Sign in to access your partner dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Use your company email to sign in to the partner portal. You'll have access to:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                Submit and manage deals
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                Upload supporting documents
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                Track deal status and approvals
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                View commission details
              </li>
            </ul>
          </div>

          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In with Email
          </Button>

          <div className="text-center text-xs text-gray-500">
            <p>Don't have a partner account?</p>
            <p className="mt-1">Contact us at partners@visiumtech.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
