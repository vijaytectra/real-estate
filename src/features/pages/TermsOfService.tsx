import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Terms of Service</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-8">Last updated: February 8, 2026</p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="font-display text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using PropVista, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to modify these terms at any time, and continued use constitutes acceptance of changes.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="font-display text-xl font-semibold mb-3">2. User Accounts</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">When creating an account, you agree to:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized access</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="font-display text-xl font-semibold mb-3">3. Buyer Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            Buyers may browse property listings without registration. To save favorites, schedule video calls, or book site visits, a registered account is required. PropVista acts as a platform connecting buyers and sellers and does not guarantee the accuracy of listings or the outcome of any transaction.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="font-display text-xl font-semibold mb-3">4. Seller Terms</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Sellers agree to the following conditions:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>A one-time registration fee is required to list properties</li>
            <li>All property information must be accurate and up-to-date</li>
            <li>Listings are subject to admin approval before being published</li>
            <li>Premium listing fees are non-refundable once the listing is live</li>
            <li>Sellers must respond to buyer inquiries in a timely manner</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="font-display text-xl font-semibold mb-3">5. Property Listings</h2>
          <p className="text-muted-foreground leading-relaxed">
            All property listings are submitted by registered sellers and reviewed by our admin team. PropVista reserves the right to approve, reject, or remove any listing that violates our guidelines. We do not verify property ownership or legal status — buyers are advised to conduct independent due diligence.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="font-display text-xl font-semibold mb-3">6. Prohibited Activities</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Users must not:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Post false, misleading, or fraudulent property information</li>
            <li>Use the platform for any illegal or unauthorized purpose</li>
            <li>Attempt to gain unauthorized access to other users' accounts</li>
            <li>Scrape, copy, or redistribute content from the platform</li>
            <li>Harass, threaten, or abuse other users</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="font-display text-xl font-semibold mb-3">7. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            PropVista is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from the use of our platform, including but not limited to property transactions, scheduling failures, or data loss.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="font-display text-xl font-semibold mb-3">8. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For questions about these Terms of Service, contact us at{" "}
            <a href="mailto:legal@propvista.com" className="text-primary hover:underline">
              legal@propvista.com
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
