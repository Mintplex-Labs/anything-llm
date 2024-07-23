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
      <div className="bg-[#303237] text-white rounded-xl flex-1 p-4">
        <div className="w-full flex flex-col gap-y-4">
          <h2 className="text-xl text-white font-semibold">
            Terms and Conditions
          </h2>
          <p>
            Please accept the terms and conditions to continue with creation and
            ordering of a fine-tune model.
          </p>
          <div className="flex flex-col gap-y-2 text-white/75 text-sm border p-2 border-white rounded-lg font-mono h-[60vh] overflow-y-scroll">
            <h1 className="text-white/80 text-lg font-semibold">
              Mintplex Labs Inc. Fine-Tuning Terms of Service
            </h1>
            <p>
              <strong>Last Updated:</strong> July 15, 2024
            </p>

            <p>
              This Agreement is between Mintplex Labs Inc. ("Company") and the
              customer ("Customer") accessing or using the services provided by
              the Company. By signing up, accessing, or using the services,
              Customer indicates its acceptance of this Agreement and agrees to
              be bound by the terms and conditions outlined below.
            </p>

            <h2 className="text-white/80 text-base font-semibold">
              1. Services Provided
            </h2>
            <p>
              Mintplex Labs Inc. provides model fine-tuning services for
              customers. The deliverable for these services is a download link
              to the output ".GGUF" file that can be used by the Customer for
              Large-Language text inferencing.
            </p>

            <h2 className="text-white/80 text-base font-semibold">
              2. Payment Terms
            </h2>
            <ul>
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

            <h2 className="text-white/80 text-base font-semibold">
              3. Order Form
            </h2>
            <ul>
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

            <h2 className="text-white/80 text-base font-semibold">
              4. Customer Responsibilities
            </h2>
            <p>
              The Customer must provide all necessary data and information
              required for model fine-tuning.
            </p>
            <p>
              The Customer must ensure timely payment as per the terms mentioned
              above.
            </p>
            <p>
              The Customer understands the data collected for tuning will be
              stored to a private cloud storage location temporarily while
              training is in progress.
            </p>
            <p>
              The Customer understands the data collected for tuning will be
              fully deleted once the order is completed or canceled by the
              Company.
            </p>
            <p>
              The Customer understands and has reviewed the Privacy Policy for
              Fine-Tuning by the Company.
            </p>

            <h2 className="text-white/80 text-base font-semibold">
              5. Refund Policy
            </h2>
            <p>
              Refunds will be processed in the event of training failure or if
              the complete model file is not delivered to the Customer. Refunds
              will be issued to the original payment method within 30 days of
              the refund request.
            </p>

            <h2 className="text-white/80 text-base font-semibold">
              6. Governing Law
            </h2>
            <p>
              This Agreement shall be governed by and construed in accordance
              with the laws of the State of California.
            </p>

            <h2 className="text-white/80 text-base font-semibold">
              7. Dispute Resolution
            </h2>
            <p>
              Any disputes arising out of or in connection with this Agreement
              shall be resolved in the state or federal courts located in
              California.
            </p>

            <h2 className="text-white/80 text-base font-semibold">
              8. Notices
            </h2>
            <p>
              All notices under this Agreement shall be in writing and shall be
              deemed given when delivered personally, sent by confirmed email,
              or sent by certified or registered mail, return receipt requested,
              and addressed to the respective parties as follows:
            </p>
            <p>
              For Company:{" "}
              <a href="mailto:team@mintplexlabs.com">team@mintplexlabs.com</a>
            </p>
            <p>For Customer: The main email address on Customer's account</p>

            <h2 className="text-white/80 text-base font-semibold">
              9. Amendments
            </h2>
            <p>
              The Company reserves the right to amend these terms at any time by
              providing notice to the Customer. The Customer's continued use of
              the services after such amendments will constitute acceptance of
              the amended terms.
            </p>

            <h2 className="text-white/80 text-base font-semibold">
              10. Indemnity
            </h2>
            <p>
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
        </div>

        <button
          onClick={handleAccept}
          type="button"
          className="mt-8 w-full py-2 text-center text-white hover:bg-primary-button border-none rounded-lg"
        >
          Agree and continue &rarr;
        </button>
      </div>
    </div>
  );
}
