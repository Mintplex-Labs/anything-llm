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
      <div className="bg-[#303237] text-white rounded-xl flex-1 p-4">
        <div className="w-full flex flex-col gap-y-4">
          <h2 className="text-xl text-white font-semibold">
            Fulfillment Policy
          </h2>
          <p>
            Fulfillment of a fine-tune model is straight-forward. We do not host
            your model. We provide you a download link to run the model in a
            standard format where ever you run local LLMs
          </p>
          <div className="flex flex-col gap-y-2 text-white/75 text-sm border p-2 border-white rounded-lg font-mono h-[60vh] overflow-y-scroll">
            <h1 class="text-white/80 text-lg font-semibold">
              Fulfillment Terms
            </h1>
            <p>
              <strong>Last updated: July 15, 2024</strong>
            </p>

            <p>
              These fulfillment terms outline the agreement between Mintplex
              Labs Inc. (“Company,” “we,” “us,” or “our”) and the customer
              regarding the creation and delivery of fine-tuned models.
            </p>

            <h2 class="text-white/80 text-base font-semibold">
              Delivery of Model
            </h2>
            <p>
              Upon completion of a fine-tuning job, we will deliver a download
              link to a .gguf model file suitable for LLM text inferencing. The
              customer acknowledges that this exchange is strictly transactional
              and non-recurring. Once the model file is delivered, the agreement
              is considered concluded and will be ineligible for a refund.
            </p>

            <h2 class="text-white/80 text-base font-semibold">Support</h2>
            <p>
              Please note that the delivery of the model does not include any
              dedicated support. Customers are encouraged to refer to available
              documentation and resources for guidance on using the model.
            </p>

            <h2 class="text-white/80 text-base font-semibold">
              Requesting Download Links
            </h2>
            <p>
              Customers may request refreshed download links from
              my.mintplexlabs.com as long as the model is retained in our cloud
              storage. We will retain a model in our storage for a maximum of 3
              months or until the customer requests its removal. All download
              links are valid for 24 hours.
            </p>

            <h2 class="text-white/80 text-base font-semibold">
              Cancellation and Refunds
            </h2>
            <p>
              Mintplex Labs Inc. reserves the right to cancel any fine-tuning
              job at our discretion. In the event of a cancellation, a refund
              may be issued. Additionally, we reserve the right to deny a
              payment from the Customer or issue refunds for any reason without
              cause or notice to the Customer.
            </p>

            <h2 class="text-white/80 text-base font-semibold">No Guarantees</h2>
            <p>
              Mintplex Labs Inc. makes <strong>NO GUARANTEES</strong> regarding
              the resulting model's output, functionality, speed, or
              compatibility with your tools, infrastructure and devices. Refund
              requests of this nature are not eligible for refunds.
            </p>
            <p>
              Models are delivered and accepted in "As-Is" condition. All
              delivered model and output files are deemed final and
              non-refundable for any reason after training is complete and a
              model has been generated.
            </p>

            <h2 class="text-white/80 text-base font-semibold">Payment Terms</h2>
            <p>
              All payments are required prior to the commencement of the
              fine-tuning process. Customers are responsible for ensuring that
              valid payment information is provided. Checkout sessions not
              completed within 1 hour of creation will be considered as
              abandoned and will be deleted from our system.
            </p>

            <h2 class="text-white/80 text-base font-semibold">
              Denial of Service for Payment Reasons
            </h2>
            <p>
              Mintplex Labs Inc. reserves the right to deny service to any
              customer with an outstanding balance or invalid payment
              information. If any discrepancies arise regarding payment or
              usage, we may suspend services until the matter is resolved.
            </p>

            <h2 class="text-white/80 text-base font-semibold">Contact</h2>
            <p>
              For any questions related to payment or fulfillment of services,
              please contact us at{" "}
              <a href="mailto:team@mintplexlabs.com">team@mintplexlabs.com</a>.
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
