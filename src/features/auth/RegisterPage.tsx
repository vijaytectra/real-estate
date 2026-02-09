import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { register, clearError } from "@/store/authSlice";
import { addNotification } from "@/store/notificationSlice";
import type { UserRole } from "@/types";
import { toast } from "sonner";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const [registrationPaid, setRegistrationPaid] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phone) {
      toast.error("Please fill in all fields");
      return;
    }
    if (role === "seller" && !registrationPaid) {
      toast.error("Sellers must agree to registration fee");
      return;
    }
    dispatch(clearError());
    const result = await dispatch(register({ name, email, role, phone, registrationPaid }));
    if (register.fulfilled.match(result)) {
      dispatch(addNotification({
        title: "Welcome to PropVista!",
        message: `Your ${role} account has been created successfully.`,
        type: "system",
      }));
      toast.success("Account created successfully!");
      navigate(role === "buyer" ? "/buyer/dashboard" : role === "seller" ? "/seller/dashboard" : "/");
    } else {
      toast.error(result.payload as string);
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
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Join PropVista to buy, sell, or manage properties</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email">Email <span className="text-red-500">*</span></Label>
            <Input id="reg-email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
            <Input id="phone" type="tel" placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>I want to <span className="text-red-500">*</span></Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buy Properties</SelectItem>
                <SelectItem value="seller">Sell / List Properties</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Seller Payment */}
          {role === "seller" && (
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Registration Fee</p>
                    <p className="text-xs text-muted-foreground">
                      One-time fee of <strong className="text-accent">Rs. 999</strong> to list properties
                    </p>
                  </div>
                  <Switch
                    checked={registrationPaid}
                    onCheckedChange={setRegistrationPaid}
                    aria-label="Agree to registration fee"
                  />
                </div>
                {registrationPaid && (
                  <p className="text-xs text-success font-medium">
                    Payment will be processed (mock)
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {error && <p className="text-sm text-destructive text-center" role="alert">{error}</p>}

          <Button className="w-full h-12" onClick={handleRegister} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>

          <Separator />

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
