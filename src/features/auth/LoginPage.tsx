import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Building2, Chrome, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { loginWithGoogle, clearError } from "@/store/authSlice";
import { toast } from "sonner";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const [email, setEmail] = useState("");

  const handleLogin = async (loginEmail: string) => {
    if (!loginEmail) {
      toast.error("Please enter an email");
      return;
    }
    dispatch(clearError());
    const result = await dispatch(loginWithGoogle(loginEmail));
    if (loginWithGoogle.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.name}!`);
      navigate(from, { replace: true });
    } else {
      toast.error(result.payload as string);
    }
  };

  // Simulates Google OAuth popup — logs in as the default buyer
  const handleGoogleSignIn = async () => {
    dispatch(clearError());
    const result = await dispatch(loginWithGoogle("buyer@test.com"));
    if (loginWithGoogle.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.name}!`);
      navigate(from, { replace: true });
    } else {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold text-primary">
              Prop<span className="text-accent">Vista</span>
            </span>
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to access your dashboard and saved properties</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Login — simulated OAuth, no email needed */}
          <Button
            variant="outline"
            className="w-full h-12 text-base"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <Chrome className="h-5 w-5 mr-2" />
            {loading ? "Signing in..." : "Sign in with Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or use a test account</span>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin(email)}
              />
            </div>
          </div>

          <Button
            className="w-full"
            onClick={() => handleLogin(email)}
            disabled={loading || !email}
          >
            {loading ? "Signing in..." : "Sign in with Email"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          {error && <p className="text-sm text-destructive text-center" role="alert">{error}</p>}

          {/* Quick Login Buttons */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center">Quick login as:</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Buyer", email: "buyer@test.com" },
                { label: "Seller", email: "seller@test.com" },
                { label: "Admin", email: "admin@test.com" },
              ].map((preset) => (
                <Button
                  key={preset.email}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleLogin(preset.email)}
                  disabled={loading}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
