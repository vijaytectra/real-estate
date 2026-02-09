import { Link } from "react-router-dom";
import { ArrowLeft, Lock, ShieldCheck, Server, KeyRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SSLSecured() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
          <Lock className="h-5 w-5 text-success" />
        </div>
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">SSL Secured</h1>
          <Badge variant="success" className="mt-1">Active</Badge>
        </div>
      </div>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        PropVista uses industry-standard SSL/TLS encryption to ensure all data transmitted between your browser and our servers is secure and protected.
      </p>

      {/* Security Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: Lock,
            title: "256-bit Encryption",
            description: "All data is encrypted using AES-256 bit encryption, the same standard used by banks and financial institutions.",
          },
          {
            icon: ShieldCheck,
            title: "TLS 1.3 Protocol",
            description: "We use the latest TLS 1.3 protocol for the fastest and most secure connections available.",
          },
          {
            icon: Server,
            title: "Secure Hosting",
            description: "Our platform is hosted on enterprise-grade infrastructure with 99.9% uptime and DDoS protection.",
          },
          {
            icon: KeyRound,
            title: "Data Protection",
            description: "User credentials are hashed using bcrypt. We never store plain-text passwords or sensitive data.",
          },
        ].map((feature) => (
          <Card key={feature.title}>
            <CardContent className="p-5">
              <feature.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="mb-8" />

      <div className="space-y-6">
        <section>
          <h2 className="font-display text-xl font-semibold mb-3">What Does SSL Mean for You?</h2>
          <p className="text-muted-foreground leading-relaxed">
            When you see the padlock icon in your browser's address bar, it means your connection to PropVista is fully encrypted. This protects your personal information, login credentials, and all communications from being intercepted by third parties.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="font-display text-xl font-semibold mb-3">Our Security Practices</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>HTTPS enforced across all pages — no unencrypted connections allowed</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Strict Content Security Policy (CSP) headers</li>
            <li>HTTP Strict Transport Security (HSTS) enabled</li>
            <li>Protected API endpoints with rate limiting</li>
            <li>Secure authentication with OAuth 2.0 (Google Sign-In)</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="font-display text-xl font-semibold mb-3">Report a Security Issue</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you discover a security vulnerability, please report it responsibly to{" "}
            <a href="mailto:security@propvista.com" className="text-primary hover:underline">
              security@propvista.com
            </a>. We take all reports seriously and will respond within 24 hours.
          </p>
        </section>
      </div>
    </div>
  );
}
