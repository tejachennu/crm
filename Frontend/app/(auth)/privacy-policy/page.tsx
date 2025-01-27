import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicy() {
  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
      </CardHeader>
      <CardContent>
          <div className="space-y-6">
            <p>
              This privacy policy applies to the Data Analytics Tracking Framework for Unified Branding aka DATAFUB
              ("App") developed by DEEP Trust – A nonprofit organization. ("we", "us", or "our"). This policy describes
              how we collect, use, share, and protect your personal information when you use our App.
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
              <p>We collect the following types of information:</p>
              <ol className="list-decimal list-inside space-y-2 mt-2">
                <li>
                  Information you provide:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Account information (name, email address)</li>
                    <li>Profile information</li>
                    <li>Content you create or share through the App</li>
                  </ul>
                </li>
                <li>
                  Information we automatically collect:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Usage data (features accessed, time spent on App)</li>
                    <li>Device information (device type, operating system)</li>
                    <li>Log data (IP address, browser type)</li>
                  </ul>
                </li>
                <li>
                  Information from Facebook:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Basic profile information (name, profile picture)</li>
                    <li>Email address</li>
                    <li>Friends list (if permission granted)</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Provide and improve our App functionality</li>
                <li>Personalize your experience</li>
                <li>Analyze usage patterns and trends</li>
                <li>Communicate with you about App updates and features</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Information Sharing and Disclosure</h2>
              <p>We may share your information:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>With service providers who assist in App operations</li>
                <li>In response to legal requests or to protect our rights</li>
                <li>In connection with a merger, sale, or asset transfer</li>
              </ul>
              <p className="mt-2">We do not sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Your Choices and Rights</h2>
              <p>You can:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Access and update your information through your App settings</li>
                <li>Opt-out of promotional communications</li>
                <li>Request deletion of your account and associated data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Data Retention and Security</h2>
              <p>
                We retain your data for as long as necessary to provide our services or as required by law. We implement
                appropriate technical and organizational measures to protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Changes to This Policy</h2>
              <p>
                We may update this policy periodically. We will notify you of any significant changes through the App or
                via email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
              <p>If you have any questions about this privacy policy, please contact us at:</p>
              <p className="mt-2">Email: info@deepindia.org</p>
              <p>Address: Road No: 70, A, Plot No.45, Journalist Colony, Jubilee Hills, Hyderabad, Telangana 500033</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Facebook-Specific Disclosures</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>We use Facebook Login for authentication purposes</li>
                <li>We access your public profile and email address through Facebook</li>
                <li>You can revoke our access to your Facebook data at any time through your Facebook settings</li>
                <li>We use cookies and similar technologies to enhance your experience and collect usage data</li>
              </ul>
            </section>

            <p className="mt-4">By using our App, you consent to our privacy practices as outlined in this policy.</p>
          </div>

      </CardContent>
    </Card>
  )
}

