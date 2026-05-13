import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `Terms of Service — ${siteConfig.name}`,
  description: `Terms of Service for ${siteConfig.name}. Read about your rights and obligations when using our marketplace.`,
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-stone-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-stone-900 lg:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">
            Last updated: May 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="prose prose-stone max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:leading-relaxed prose-p:text-stone-600 prose-li:text-stone-600 prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline">
            <p>
              Welcome to {siteConfig.name}. By accessing or using our website at{" "}
              <a href={siteConfig.url}>{siteConfig.url}</a>, you agree to be
              bound by these Terms of Service. If you do not agree with any part
              of these terms, you may not use our services.
            </p>

            <h2>1. Platform Description</h2>
            <p>
              {siteConfig.name} is a classified advertisement marketplace for
              retro, classic, and beautiful automobiles. We provide a platform for
              sellers to list vehicles and for buyers to discover them. {siteConfig.name}{" "}
              is not a party to any transaction between buyers and sellers. We do
              not own, inspect, or guarantee any vehicle listed on our platform.
            </p>

            <h2>2. User Accounts</h2>
            <p>
              To list a vehicle on {siteConfig.name}, you must create an account
              and provide accurate, complete information. You are responsible for
              maintaining the confidentiality of your account credentials and for
              all activity that occurs under your account.
            </p>

            <h2>3. User Obligations</h2>
            <p>By using our platform, you agree to:</p>
            <ul>
              <li>Provide accurate and truthful information in all listings</li>
              <li>
                Only list vehicles that you own or are legally authorised to sell
              </li>
              <li>Use real, unaltered photographs of the actual vehicle</li>
              <li>Respond promptly and honestly to buyer enquiries</li>
              <li>
                Not engage in any fraudulent, deceptive, or misleading practices
              </li>
              <li>Comply with all applicable local, national, and EU laws</li>
            </ul>

            <h2>4. Listing Fees</h2>
            <p>
              Vehicle listing fees on {siteConfig.name} vary by plan (Starter, Collector, or Dealer).
              This fee is charged at the time of listing publication and is{" "}
              <strong>non-refundable</strong>, regardless of whether the vehicle
              sells. The listing fee covers publication on our platform for the
              listing duration specified at the time of purchase.
            </p>

            <h2>5. Content Policy</h2>
            <p>All content submitted to {siteConfig.name} must:</p>
            <ul>
              <li>Be relevant to the vehicle being listed</li>
              <li>
                Not contain offensive, discriminatory, or inappropriate material
              </li>
              <li>Use real photographs of the actual vehicle (no stock images)</li>
              <li>Not infringe on any third-party intellectual property rights</li>
              <li>Not contain misleading or false information</li>
            </ul>
            <p>
              We reserve the right to remove any content that violates these
              guidelines without prior notice or refund.
            </p>

            <h2>6. No Warranty on Transactions</h2>
            <p>
              {siteConfig.name} acts solely as a platform connecting buyers and
              sellers. We make no warranties or representations regarding:
            </p>
            <ul>
              <li>The condition, legality, or safety of listed vehicles</li>
              <li>The accuracy of listing descriptions or photographs</li>
              <li>The ability of sellers to complete a sale</li>
              <li>The ability of buyers to complete a purchase</li>
            </ul>
            <p>
              All transactions are conducted directly between buyers and sellers.
              We strongly recommend independent vehicle inspections before any
              purchase.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, {siteConfig.name} and its
              operators shall not be liable for any direct, indirect, incidental,
              special, consequential, or punitive damages arising from:
            </p>
            <ul>
              <li>Your use of or inability to use our platform</li>
              <li>
                Any transaction or dispute between buyers and sellers
              </li>
              <li>
                Any unauthorised access to or alteration of your data
              </li>
              <li>Any errors, inaccuracies, or omissions in listings</li>
            </ul>
            <p>
              Our total liability for any claim shall not exceed the amount of
              listing fees you have paid to us in the 12 months preceding the
              claim.
            </p>

            <h2>8. Account Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at our
              sole discretion, without prior notice, if we believe you have
              violated these Terms of Service or engaged in fraudulent or harmful
              activity. Upon termination, your active listings will be removed and
              no refund of listing fees will be provided.
            </p>

            <h2>9. Intellectual Property</h2>
            <p>
              The {siteConfig.name} name, logo, website design, and all original
              content are the property of {siteConfig.name}. You may not
              reproduce, distribute, or create derivative works without our
              written consent. By submitting a listing, you grant us a
              non-exclusive licence to display your content on our platform.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance
              with the laws of France. Any disputes arising from these terms shall
              be subject to the exclusive jurisdiction of the courts of France.
            </p>

            <h2>11. Changes to These Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Continued
              use of the platform after changes are posted constitutes acceptance
              of the revised terms. We encourage you to review this page
              periodically.
            </p>

            <h2>12. Contact</h2>
            <p>
              If you have questions about these Terms of Service, please contact
              us at:{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
