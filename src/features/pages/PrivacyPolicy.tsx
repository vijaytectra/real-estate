import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-8">Last updated: February 8, 2026</p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="font-display text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            PropVista collects information you provide directly when you create an account, list a property, or schedule appointments. This includes your name, email address, phone number, and property preferences.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="font-display text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Provide, maintain, and improve our services</li>
            <li>Connect buyers with sellers and facilitate property transactions</li>
            <li>Send notifications about appointments and property updates</li>
            <li>Personalize your experience and show relevant property listings</li>
            <li>Ensure platform security and prevent fraudulent activity</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="font-display text-xl font-semibold mb-3">3. Information Sharing</h2>
          <p className="text-muted-foreground leading-relaxed">
            We do not sell your personal information to third parties. We may share your contact information with sellers when you schedule a site visit or video call, as this is essential for the service to function. We may also share anonymized, aggregated data for analytics purposes.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="font-display text-xl font-semibold mb-3">4. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement industry-standard security measures including SSL/TLS encryption, secure data storage, and regular security audits. While no system is completely secure, we strive to protect your personal information using commercially acceptable means.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="font-display text-xl font-semibold mb-3">5. Cookies & Tracking</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use cookies and local storage to remember your preferences (such as dark mode settings), maintain your session, and improve your browsing experience. You can configure your browser to refuse cookies, though some features may not function properly.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="font-display text-xl font-semibold mb-3">6. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Access and download your personal data</li>
            <li>Correct inaccurate information in your profile</li>
            <li>Delete your account and associated data</li>
            <li>Opt out of marketing communications</li>
            <li>Withdraw consent for data processing at any time</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="font-display text-xl font-semibold mb-3">7. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@propvista.com" className="text-primary hover:underline">
              privacy@propvista.com
            </a>{" "}
            or call us at{" "}
            <a href="tel:+919876543210" className="text-primary hover:underline">
              +91 98765 43210
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
