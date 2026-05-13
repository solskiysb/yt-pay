import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `Privacy Policy — ${siteConfig.name}`,
  description: `Privacy Policy for ${siteConfig.name}. Learn how we collect, use, and protect your data.`,
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-stone-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-stone-900 lg:text-5xl">
            Privacy Policy
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
              {siteConfig.name} (&quot;we&quot;, &quot;us&quot;, or
              &quot;our&quot;) operates the website{" "}
              <a href={siteConfig.url}>{siteConfig.url}</a>. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you visit our website or use our marketplace
              services.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you
              create an account, list a vehicle, or contact us:
            </p>
            <ul>
              <li>
                <strong>Personal information:</strong> name, email address, phone
                number
              </li>
              <li>
                <strong>Listing data:</strong> vehicle details, photographs,
                pricing, and descriptions you submit
              </li>
              <li>
                <strong>Payment information:</strong> billing details processed
                securely through our payment provider (we do not store card
                numbers)
              </li>
              <li>
                <strong>Communications:</strong> messages you send through our
                platform or to our support team
              </li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Operate, maintain, and improve our marketplace</li>
              <li>Process listings and facilitate communication between buyers and sellers</li>
              <li>Process payments for listing fees</li>
              <li>Send transactional emails (listing confirmations, account updates)</li>
              <li>Respond to your enquiries and provide customer support</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>3. Cookies &amp; Analytics</h2>
            <p>
              We use cookies and similar technologies solely for analytics
              purposes to understand how visitors interact with our website. These
              cookies help us improve user experience and do not track you across
              other websites.
            </p>
            <p>
              You can control cookie preferences through your browser settings.
              Disabling analytics cookies will not affect the core functionality
              of our platform.
            </p>

            <h2>4. Third-Party Services</h2>
            <p>
              We work with trusted third-party service providers to operate our
              platform:
            </p>
            <ul>
              <li>
                <strong>Supabase:</strong> database hosting and authentication
                (EU-based infrastructure)
              </li>
              <li>
                <strong>Vercel:</strong> website hosting and content delivery
              </li>
              <li>
                <strong>Stripe:</strong> secure payment processing for listing
                fees
              </li>
            </ul>
            <p>
              These providers process data on our behalf and are contractually
              obligated to protect your information in accordance with applicable
              data protection laws.
            </p>

            <h2>5. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active
              or as needed to provide our services. Listing data is retained for
              the duration of the listing plus 12 months for record-keeping
              purposes. You may request deletion of your data at any time.
            </p>

            <h2>6. Your Rights Under GDPR</h2>
            <p>
              If you are located in the European Economic Area, you have the
              following rights regarding your personal data:
            </p>
            <ul>
              <li>
                <strong>Right of access:</strong> request a copy of the personal
                data we hold about you
              </li>
              <li>
                <strong>Right to rectification:</strong> request correction of
                inaccurate or incomplete data
              </li>
              <li>
                <strong>Right to erasure:</strong> request deletion of your
                personal data
              </li>
              <li>
                <strong>Right to restrict processing:</strong> request that we
                limit how we use your data
              </li>
              <li>
                <strong>Right to data portability:</strong> receive your data in a
                structured, machine-readable format
              </li>
              <li>
                <strong>Right to object:</strong> object to processing of your
                data for certain purposes
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. We
              will respond to your request within 30 days.
            </p>

            <h2>7. Data Security</h2>
            <p>
              We implement appropriate technical and organisational measures to
              protect your personal data against unauthorised access, alteration,
              disclosure, or destruction. However, no method of transmission over
              the Internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>

            <h2>8. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to individuals under 18 years of age.
              We do not knowingly collect personal data from children.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify
              you of any material changes by posting the updated policy on this
              page with a revised &quot;Last updated&quot; date.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise
              your data protection rights, please contact us at:
            </p>
            <p>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
