import CTAButton from "@/components/lib/CTAButton";
import FineTuningSteps from "..";

export default function Fulfillment({ setSettings, setStep }) {
  const handleAccept = () => {
    setSettings((prev) => {
      return { ...prev, agreedToTerms: true };
    });
    setStep(FineTuningSteps.fulfillment.next());
  };

  return (
    <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
      <div className="bg-theme-bg-secondary rounded-xl flex-1 p-6">
        <div className="w-full flex flex-col gap-y-3 max-w-[700px]">
          <h2 className="text-base text-theme-text-primary font-semibold">
            Fulfillment Policy
          </h2>
          <p className="text-theme-text-secondary text-sm">
            Fulfillment of a fine-tune model is straight-forward. We do not host
            your model. We provide you a download link to run the model in a
            standard format where ever you run local LLMs
          </p>
          <div className="flex flex-col gap-y-2 text-theme-text-secondary text-xs font-semibold rounded-lg p-4 h-[60vh] overflow-y-auto bg-theme-bg-container mt-2">
            <div className="text-xs">
              <h1 className="text-theme-text-primary">Fulfillment Terms</h1>
              <p className="text-theme-text-secondary">
                Last updated: July 15, 2024
              </p>
            </div>
            <p className="text-theme-text-secondary">
              These fulfillment terms outline the agreement between Mintplex
              Labs Inc. ("Company," "we," "us," or "our") and the customer
              regarding the creation and delivery of fine-tuned models.
            </p>

            <h2 className="text-theme-text-primary mt-4">Delivery of Model</h2>
            <p className="text-theme-text-secondary">
              Upon completion of a fine-tuning job, we will deliver a download
              link to a .gguf model file suitable for LLM text inferencing. The
              customer acknowledges that this exchange is strictly transactional
              and non-recurring. Once the model file is delivered, the agreement
              is considered concluded and will be ineligible for a refund.
            </p>

            <h2 className="text-theme-text-primary mt-4">Support</h2>
            <p className="text-theme-text-secondary">
              Please note that the delivery of the model does not include any
              dedicated support. Customers are encouraged to refer to available
              documentation and resources for guidance on using the model.
            </p>

            <h2 className="text-theme-text-primary mt-4">
              Requesting Download Links
            </h2>
            <p className="text-theme-text-secondary">
              Customers may request refreshed download links from
              my.mintplexlabs.com as long as the model is retained in our cloud
              storage. We will retain a model in our storage for a maximum of 3
              months or until the customer requests its removal. All download
              links are valid for 24 hours.
            </p>

            <h2 className="text-theme-text-primary mt-4">
              Cancellation and Refunds
            </h2>
            <p className="text-theme-text-secondary">
              Mintplex Labs Inc. reserves the right to cancel any fine-tuning
              job at our discretion. In the event of a cancellation, a refund
              may be issued. Additionally, we reserve the right to deny a
              payment from the Customer or issue refunds for any reason without
              cause or notice to the Customer.
            </p>

            <h2 className="text-theme-text-primary mt-4">No Guarantees</h2>
            <p className="text-theme-text-secondary">
              Mintplex Labs Inc. makes <strong>NO GUARANTEES</strong> regarding
              the resulting model's output, functionality, speed, or
              compatibility with your tools, infrastructure and devices. Refund
              requests of this nature are not eligible for refunds.
            </p>
            <p className="text-theme-text-secondary">
              Models are delivered and accepted in "As-Is" condition. All
              delivered model and output files are deemed final and
              non-refundable for any reason after training is complete and a
              model has been generated.
            </p>

            <h2 className="text-theme-text-primary mt-4">Payment Terms</h2>
            <p className="text-theme-text-secondary">
              All payments are required prior to the commencement of the
              fine-tuning process. Customers are responsible for ensuring that
              valid payment information is provided. Checkout sessions not
              completed within 1 hour of creation will be considered as
              abandoned and will be deleted from our system.
            </p>

            <h2 className="text-theme-text-primary">
              Denial of Service for Payment Reasons
            </h2>
            <p className="text-theme-text-secondary">
              Mintplex Labs Inc. reserves the right to deny service to any
              customer with an outstanding balance or invalid payment
              information. If any discrepancies arise regarding payment or
              usage, we may suspend services until the matter is resolved.
            </p>

            <h2 className="text-theme-text-primary">Contact</h2>
            <p className="text-theme-text-secondary">
              For any questions related to payment or fulfillment of services,
              please contact us at{" "}
              <a
                href="mailto:team@mintplexlabs.com"
                className="text-blue-400 hover:underline"
              >
                team@mintplexlabs.com
              </a>
              .
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
