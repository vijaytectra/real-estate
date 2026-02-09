import { Link } from "react-router-dom";
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-card" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-display text-lg font-bold text-primary">
                Prop<span className="text-accent">Vista</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Find your dream property with India's most trusted real estate platform.
              Browse luxury listings, schedule visits, and connect directly with builders.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "Properties", to: "/?view=all" },
                { label: "Login", to: "/login" },
                { label: "Register", to: "/register" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Property Types</h4>
            <ul className="space-y-2">
              {[
                { label: "1 BHK Apartments", config: "1BHK" },
                { label: "2 BHK Apartments", config: "2BHK" },
                { label: "3 BHK Apartments", config: "3BHK" },
                { label: "4 BHK Villas", config: "4BHK" },
                { label: "Premium Listings", config: "" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.config ? `/?config=${item.config}` : `/?premium=true`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>+91 98765 43210</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@propvista.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>info@propvista.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PropVista. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/ssl-secured" className="hover:text-foreground transition-colors">
              SSL Secured
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
