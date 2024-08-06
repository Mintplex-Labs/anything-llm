import CTAButton from "@/components/lib/CTAButton";
import FineTuningSteps from "..";

export default function TermsAndConditions({ setSettings, setStep }) {
  const handleAccept = () => {
    setSettings((prev) => {
      return { ...prev, agreedToTerms: true };
    });
    setStep(FineTuningSteps.tos.next());
  };

  return (
    <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
      <div className="bg-[#303237] text-white rounded-xl flex-1 p-6">
        <div className="w-full flex flex-col gap-y-3 max-w-[700px]">
          <h2 className="text-base text-white font-semibold">
            Terms and Conditions
          </h2>
          <p className="text-white/80 text-sm">
            Please accept the terms and conditions to continue with creation and
            ordering of a fine-tune model.
          </p>
          <div className="flex flex-col gap-y-2 text-white/80 text-xs font-semibold rounded-lg p-4 h-[60vh] overflow-y-auto bg-dark-text mt-2">
            <div className="text-xs text-white">
              <h1>Mintplex Labs Inc. Fine-Tuning Terms of Service</h1>
              <p>Last Updated: July 15, 2024</p>
            </div>
            <p className="text-white/80">
              This Agreement is between Mintplex Labs Inc. ("Company") and the
              customer ("Customer") accessing or using the services provided by
              the Company. By signing up, accessing, or using the services,
              Customer indicates its acceptance of this Agreement and agrees to
              be bound by the terms and conditions outlined below.
            </p>

            <h2 className="text-white mt-4">1. Services Provided</h2>
            <p className="text-white/80">
              Mintplex Labs Inc. provides model fine-tuning services for
              customers. The deliverable for these services is a download link
              to the output ".GGUF" file that can be used by the Customer for
              Large-Language text inferencing.
            </p>

            <h2 className="text-white mt-4">2. Payment Terms</h2>
            <ul className="list-disc pl-5 text-white/80">
              <li>
                <strong>One-Time Payment:</strong> A one-time payment is
                required before the execution of the training.
              </li>
              <li>
                <strong>Payment Due Date:</strong> Payment is due upon order
                placement.
              </li>
              <li>
                <strong>Refund Policy:</strong> Payments are refundable in the
                event of training failure or if the Company fails to deliver the
                complete model file to the Customer.
              </li>
            </ul>

            <h2 className="text-white mt-4">3. Order Form</h2>
            <ul className="list-disc pl-5 text-white/80">
              <li>
                <strong>Service:</strong> Model fine-tuning
              </li>
              <li>
                <strong>Payment Amount:</strong> As specified in the order form
              </li>
              <li>
                <strong>Payment Due Date:</strong> Upon order placement
              </li>
            </ul>

            <h2 className="text-white mt-4">4. Customer Responsibilities</h2>
            <p className="text-white/80">
              The Customer must provide all necessary data and information
              required for model fine-tuning.
            </p>
            <p className="text-white/80">
              The Customer must ensure timely payment as per the terms mentioned
              above.
            </p>
            <p className="text-white/80">
              The Customer understands the data collected for tuning will be
              stored to a private cloud storage location temporarily while
              training is in progress.
            </p>
            <p className="text-white/80">
              The Customer understands the data collected for tuning will be
              fully deleted once the order is completed or canceled by the
              Company.
            </p>
            <p className="text-white/80">
              The Customer understands and has reviewed the Privacy Policy for
              Fine-Tuning by the Company.
            </p>

            <h2 className="text-white mt-4">5. Refund Policy</h2>
            <p className="text-white/80">
              Refunds will be processed in the event of training failure or if
              the complete model file is not delivered to the Customer. Refunds
              will be issued to the original payment method within 30 days of
              the refund request.
            </p>

            <h2 className="text-white mt-4">6. Governing Law</h2>
            <p className="text-white/80">
              This Agreement shall be governed by and construed in accordance
              with the laws of the State of California.
            </p>

            <h2 className="text-white mt-4">7. Dispute Resolution</h2>
            <p className="text-white/80">
              Any disputes arising out of or in connection with this Agreement
              shall be resolved in the state or federal courts located in
              California.
            </p>

            <h2 className="text-white mt-4">8. Notices</h2>
            <p className="text-white/80">
              All notices under this Agreement shall be in writing and shall be
              deemed given when delivered personally, sent by confirmed email,
              or sent by certified or registered mail, return receipt requested,
              and addressed to the respective parties as follows:
            </p>
            <p className="text-white/80">
              For Company:{" "}
              <a
                href="mailto:team@mintplexlabs.com"
                className="text-blue-400 hover:underline"
              >
                team@mintplexlabs.com
              </a>
            </p>
            <p className="text-white/80">
              For Customer: The main email address on Customer's account
            </p>

            <h2 className="text-white mt-4">9. Amendments</h2>
            <p className="text-white/80">
              The Company reserves the right to amend these terms at any time by
              providing notice to the Customer. The Customer's continued use of
              the services after such amendments will constitute acceptance of
              the amended terms.
            </p>

            <h2 className="text-white mt-4">10. Indemnity</h2>
            <p className="text-white/80">
              The Customer agrees to indemnify, defend, and hold harmless
              Mintplex Labs Inc., its affiliates, and their respective officers,
              directors, employees, agents, and representatives from and against
              any and all claims, liabilities, damages, losses, costs, expenses,
              fees (including reasonable attorneys' fees and court costs) that
              arise from or relate to: (a) the Customer's use of the services;
              (b) any violation of this Agreement by the Customer; (c) any
              breach of any representation, warranty, or covenant made by the
              Customer; or (d) the Customer's violation of any rights of another
              person or entity.
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
