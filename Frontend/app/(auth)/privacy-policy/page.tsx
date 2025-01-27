import type React from "react"

const PrivacyPolicy: React.FC = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">DataFub Privacy Policy</h1>
      <p className="mb-4">Last updated: {currentDate}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p>
          Welcome to DataFub ("we," "our," or "us"). We are committed to protecting your personal information and your
          right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
          when you use our digital marketing services or visit our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Personal information (e.g., name, email address, phone number)</li>
          <li>Business information (e.g., company name, job title)</li>
          <li>Website usage data (e.g., IP address, browser type, pages visited)</li>
          <li>Marketing and communications data</li>
          <li>Client campaign data and analytics</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
        <p>We use your information for purposes including:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Providing and improving our services</li>
          <li>Communicating with you about our services</li>
          <li>Analyzing and optimizing marketing campaigns</li>
          <li>Complying with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
        <p>We may share your information with:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Service providers and business partners</li>
          <li>Advertising and analytics partners</li>
          <li>Legal and regulatory authorities</li>
          <li>Potential buyers or investors (in the event of a sale, merger, or acquisition)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information. However,
          no method of transmission over the Internet or electronic storage is 100% secure.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
        <p>Depending on your location, you may have rights regarding your personal information, including:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Access to your personal information</li>
          <li>Correction of inaccurate data</li>
          <li>Deletion of your personal information</li>
          <li>Objection to or restriction of processing</li>
          <li>Data portability</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to collect and store information about how you use our
          website and services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Third-Party Links</h2>
        <p>
          Our website and services may contain links to third-party websites. We are not responsible for the privacy
          practices or content of these sites.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
        <p>
          Our services are not intended for individuals under the age of 16. We do not knowingly collect personal
          information from children.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your own. We ensure appropriate
          safeguards are in place to protect your information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting
          the new policy on our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <address className="mt-2 not-italic">
          DataFub
          <br />
          [Address]
          <br />
          Email:{" "}
          <a href="mailto:privacy@datafub.com" className="text-blue-600 hover:underline">
            privacy@datafub.com
          </a>
          <br />
          Phone: [Phone Number]
        </address>
      </section>
    </div>
  )
}

export default PrivacyPolicy

