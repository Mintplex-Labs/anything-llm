import CTAButton from "@/components/lib/CTAButton";
import FineTuningSteps from "..";

export default function PrivacyHandling({ setSettings, setStep }) {
  const handleAccept = () => {
    setSettings((prev) => {
      return { ...prev, agreedToPrivacy: true };
    });
    setStep(FineTuningSteps.privacy.next());
  };

  return (
    <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
      <div className="bg-theme-bg-secondary rounded-xl flex-1 p-6">
        <div className="w-full flex flex-col gap-y-3 max-w-[700px]">
          <h2 className="text-base text-theme-text-primary font-semibold">
            Data Handling Policy & Privacy
          </h2>
          <p className="text-theme-text-secondary text-sm">
            Please accept the terms and conditions to continue with creation and
            ordering of a fine-tune model. We take the handling of your data
            very seriously and will only use your uploaded data for training the
            model, after the model is created or the order is concluded,
            completed, or canceled your information is automatically and
            permanently deleted.
          </p>
          <div className="flex flex-col gap-y-2 text-theme-text-secondary text-xs font-semibold rounded-lg p-4 h-[60vh] overflow-y-auto bg-theme-bg-container mt-2">
            <div className="text-xs">
              <h1 className="text-theme-text-secondary">Privacy Policy</h1>
              <p>Mintplex Labs Inc.</p>
              <p>Effective Date: July 15, 2024</p>
            </div>
            <h2 className="text-theme-text-primary mt-4">1. Introduction</h2>
            <p className="text-theme-text-secondary">
              Welcome to Mintplex Labs Inc. ("we", "our", "us"). We are
              committed to protecting your privacy and ensuring the security of
              your personal information. This Privacy Policy describes how we
              collect, use, and protect your information when you use our
              services.
            </p>

            <h2 className="text-theme-text-primary mt-4">
              2. Information We Collect
            </h2>
            <p className="text-theme-text-secondary">
              When you place an order with us for tuning and large language
              model (LLM) fulfillment, we collect certain personal information
              from you, including but not limited to:
            </p>
            <ul className="list-disc pl-5 text-theme-text-secondary">
              <li>Email address</li>
              <li>Payment information</li>
              <li>Uploaded training data</li>
            </ul>

            <h2 className="text-theme-text-primary mt-4">
              3. Use of Information
            </h2>
            <p className="text-theme-text-secondary">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc pl-5 text-theme-text-secondary">
              <li>To process and fulfill your order</li>
              <li>To communicate with you regarding your order</li>
              <li>To improve our services</li>
            </ul>

            <h2 className="text-theme-text-primary mt-4">
              4. Data Retention and Deletion
            </h2>
            <p className="text-theme-text-secondary">
              Uploaded training data is only retained for the duration of the
              model training. Upon training completion, failure, or order
              cancellation, the user data is permanently deleted from our
              storage.
            </p>
            <p className="text-theme-text-secondary">
              If you partially complete the order flow and do not finalize your
              order, any details and information associated with your order will
              be deleted 1 hour from abandonment.
            </p>
            <p className="text-theme-text-secondary">
              After you confirm receipt of your resulting model files, you can
              request us to delete your model from our storage at any time.
              Additionally, we may proactively reach out to you to confirm that
              you have received your model so we can delete it from storage. Our
              model file retention policy is 3 months, after which we will
              contact you to confirm receipt so we can remove the model from our
              storage.
            </p>

            <h2 className="text-theme-text-primary mt-4">
              5. Data Storage and Security
            </h2>
            <p className="text-theme-text-secondary">
              Our cloud storage provider is AWS. We have implement standard
              encryption and protection policies to ensure the security of your
              data. The storage solution has no public access, and all requests
              for download URLs are pre-validated and signed by a minimal trust
              program. Download URLs for the model file and associated outputs
              are valid for 24 hours at a time. After expiration you can produce
              refreshed links from https://my.mintplexlabs.com using the same
              e-mail you used during checkout.
            </p>

            <h2 className="text-theme-text-primary mt-4">
              6. Payment Processing
            </h2>
            <p className="text-theme-text-secondary">
              We use Stripe as our payment processor. Your email may be shared
              with Stripe for customer service and payment management purposes.
            </p>

            <h2 className="text-theme-text-primary mt-4">7. Data Sharing</h2>
            <p className="text-theme-text-secondary">
              We do not sell or share your personal information with third
              parties except as necessary to provide our services, comply with
              legal obligations, or protect our rights.
            </p>

            <h2 className="text-theme-text-primary mt-4">8. Your Rights</h2>
            <p className="text-theme-text-secondary">
              You have the right to access, correct, or delete your personal
              information. If you wish to exercise these rights, please contact
              us at{" "}
              <a
                href="mailto:team@mintplexlabs.com"
                className="text-blue-400 hover:underline"
              >
                team@mintplexlabs.com
              </a>
              .
            </p>

            <h2 className="text-theme-text-primary mt-4">
              9. California Privacy Rights
            </h2>
            <p className="text-theme-text-secondary">
              Under the California Consumer Privacy Act as amended by the
              California Privacy Rights Act (the "CCPA"), California residents
              have additional rights beyond what is set out in this privacy
              notice:
            </p>
            <ul className="list-disc pl-5 text-theme-text-secondary">
              <li>
                <strong>Right to Know:</strong> You have the right to request
                information about the categories and specific pieces of personal
                information we have collected about you, as well as the
                categories of sources from which the information is collected,
                the purpose for collecting such information, and the categories
                of third parties with whom we share personal information.
              </li>
              <li>
                <strong>Right to Delete:</strong> You have the right to request
                the deletion of your personal information, subject to certain
                exceptions.
              </li>
              <li>
                <strong>Right to Correct:</strong> You have the right to request
                the correction of inaccurate personal information that we have
                about you.
              </li>
              <li>
                <strong>Right to Opt-Out:</strong> You have the right to opt-out
                of the sale of your personal information. Note, however, that we
                do not sell your personal information.
              </li>
              <li>
                <strong>Right to Non-Discrimination:</strong> You have the right
                not to receive discriminatory treatment for exercising any of
                your CCPA rights.
              </li>
            </ul>
            <p className="text-theme-text-secondary">
              <strong>Submitting a Request:</strong>
              <br />
              You may submit a request to know, delete, or correct your personal
              information by contacting us at{" "}
              <a
                href="mailto:team@mintplexlabs.com"
                className="text-blue-400 hover:underline"
              >
                team@mintplexlabs.com
              </a>
              . We will confirm your identity before processing your request and
              respond within 45 days. If more time is needed, we will inform you
              of the reason and extension period in writing. You may make a
              request for your information twice every 12 months. If you are
              making an erasure request, please include details of the
              information you would like erased.
            </p>
            <p className="text-theme-text-secondary">
              Please note that if you request that we remove your information,
              we may retain some of the information for specific reasons, such
              as to resolve disputes, troubleshoot problems, and as required by
              law. Some information may not be completely removed from our
              databases due to technical constraints and regular backups.
            </p>
            <p className="text-theme-text-secondary">
              We will not discriminate against you for exercising any of your
              CCPA rights.
            </p>

            <h2 className="text-theme-text-primary mt-4">10. Contact Us</h2>
            <p className="text-theme-text-secondary">
              If you have any questions or concerns about this Privacy Policy,
              please contact us at{" "}
              <a
                href="mailto:team@mintplexlabs.com"
                className="text-blue-400 hover:underline"
              >
                team@mintplexlabs.com
              </a>
              .
            </p>

            <h2 className="text-theme-text-primary mt-4">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-theme-text-secondary">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on our
              website. You are advised to review this Privacy Policy
              periodically for any changes.
            </p>
            <p className="text-theme-text-secondary">
              By using our services, you agree to the terms of this Privacy
              Policy.
            </p>
          </div>
          <CTAButton
            className="text-dark-text w-full mt-[18px] h-[34px] hover:bg-accent"
            onClick={handleAccept}
          >
            Agree and continue &rarr;
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
