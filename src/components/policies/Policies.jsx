import React from "react";

// Terms & Conditions Page
export function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 prose prose-lg">
      <h1>Terms & Conditions</h1>

      <p>
        Welcome to Sailibrary. These Terms and Conditions ("Terms") govern your use of
        https://www.sailibrary.online/ (the "Website"). By accessing or using the Website,
        you agree to be bound by these Terms. If you do not agree with any part of these
        Terms, you must not use the Website.
      </p>

      <h2>1. Use of the Website</h2>
      <p>
        You may use the Website for lawful purposes only. You must not use the Website in
        any way that infringes any applicable local, national, or international law or
        regulation.
      </p>

      <h2>2. Account</h2>
      <p>
        Some features may require you to create an account. You are responsible for
        maintaining the confidentiality of your account credentials and for all activities
        that occur under your account.
      </p>

      <h2>3. Intellectual Property</h2>
      <p>
        All content on the Website including text, images, logos and other materials is
        owned or licensed by Sailibrary. You may not reproduce, distribute, or create
        derivative works from the content without prior written permission.
      </p>

      <h2>4. Third-party Links</h2>
      <p>
        The Website may contain links to third-party websites. We do not control and are
        not responsible for the content or privacy practices of third-party sites.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Sailibrary and its team will not be liable
        for any indirect, incidental, special, consequential or punitive damages arising
        out of your use of the Website.
      </p>

      <h2>6. Modifications</h2>
      <p>
        We may modify these Terms at any time. Any changes will be posted on this page
        with an updated effective date. Continued use of the Website after changes means
        you accept the new Terms.
      </p>

      <h2>7. Governing Law</h2>
      <p>These Terms are governed by the laws of India. Any disputes will be subject to the courts in India.</p>

      <hr />
      <p className="text-sm">Last updated: December 7, 2025</p>
    </main>
  );
}

// Privacy Policy Page
export function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 prose prose-lg">
      <h1>Privacy Policy</h1>

      <p>
        This Privacy Policy explains how Sailibrary collects, uses, shares, and protects
        your personal information when you use https://www.sailibrary.online/ (the
        "Website"). By using the Website, you consent to the practices described here.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>Personal information you provide (name, email, contact details)</li>
        <li>Payment details processed securely by our payment partner (Razorpay)</li>
        <li>Automatically collected data (IP address, device, browser, usage data)</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <p>We use the data to:</p>
      <ul>
        <li>Provide and maintain our services</li>
        <li>Process payments and send transactional emails</li>
        <li>Improve the Website and personalize user experience</li>
      </ul>

      <h2>3. Cookies & Tracking</h2>
      <p>
        We use cookies and similar technologies to collect information about how you
        interact with the Website. You can control cookies via your browser settings.
      </p>

      <h2>4. Sharing & Third Parties</h2>
      <p>
        We may share personal information with service providers (e.g., payment
        processors, hosting providers) only to the extent necessary to provide our
        services. We do not sell personal data to third parties.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We implement reasonable security measures to protect personal information, but no
        method of transmission over the internet is completely secure.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data. To
        exercise these rights, please contact us at the address below.
      </p>

      <h2>7. Contact</h2>
      <p>
        For privacy-related requests, email us at: <a href="mailto:dikshantyadav2024@gmail.com">dikshantyadav2024@gmail.com</a>
      </p>

      <hr />
      <p className="text-sm">Last updated: December 7, 2025</p>
    </main>
  );
}

// Return / Refund / Cancellation Policy Page
export function RefundPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 prose prose-lg">
      <h1>Return, Refund & Cancellation Policy</h1>

      <p>
        This policy describes our practices regarding cancellations, returns (if
        applicable), and refunds for purchases made via https://www.sailibrary.online/.
      </p>

      <h2>1. Cancellations</h2>
      <p>
        Customers may cancel paid orders within 24 hours of purchase provided the order
        has not been fulfilled. To request a cancellation, please contact our support
        team at <a href="mailto:dikshantyadav2024@gmail.com">dikshantyadav2024@gmail.com</a>.
      </p>

      <h2>2. Refunds</h2>
      <p>
        Refunds will be processed after verification and may take 7–10 business days to
        reflect in the customer's account depending on the payment method and bank.
      </p>

      <h2>3. Returns</h2>
      <p>
        If physical goods are sold via the Website and are eligible for return, return
        instructions and timelines will be provided on the order confirmation. Digital
        goods are generally non-refundable unless otherwise stated.
      </p>

      <h2>4. Partial Refunds</h2>
      <p>In some cases, partial refunds may be issued (for example, for partially fulfilled orders).</p>

      <h2>5. Contact</h2>
      <p>
        For cancellation or refund requests, please email: <a href="mailto:dikshantyadav2024@gmail.com">dikshantyadav2024@gmail.com</a>
      </p>

      <hr />
      <p className="text-sm">Last updated: December 7, 2025</p>
    </main>
  );
}

// Default export: a small navigation component to preview the pages
export default function Policies() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Sailibrary — Policy Pages</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a href="#terms" className="block p-3 border rounded-lg hover:shadow">
            Terms &amp; Conditions
          </a>
          <a href="#privacy" className="block p-3 border rounded-lg hover:shadow">
            Privacy Policy
          </a>
          <a href="#refund" className="block p-3 border rounded-lg hover:shadow">
            Return / Refund / Cancellation
          </a>
        </div>

        <div id="terms" className="mt-6">
          <TermsPage />
        </div>

        <div id="privacy" className="mt-6">
          <PrivacyPage />
        </div>

        <div id="refund" className="mt-6">
          <RefundPage />
        </div>
      </div>
    </div>
  );
}
