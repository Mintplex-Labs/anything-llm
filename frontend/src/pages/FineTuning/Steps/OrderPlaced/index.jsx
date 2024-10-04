import CTAButton from "@/components/lib/CTAButton";
import paths from "@/utils/paths";

export default function OrderPlaced({ settings }) {
  return (
    <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
      <div className="bg-[#303237] text-white rounded-xl flex-1 p-6">
        <div className="w-full flex flex-col gap-y-2 max-w-[700px]">
          <h2 className="text-base text-white font-semibold">
            Your order is placed!
          </h2>
          <div className="flex flex-col gap-y-[25px] text-white/80 text-xs">
            <p>
              Your fine-tune will begin once payment is complete. If the payment
              window did not automatically open - your checkout link is below.
            </p>
            <a
              href={settings.checkoutUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:underline hover:cursor-pointer"
            >
              {new URL(settings.checkoutUrl).origin}
            </a>
            <p className="text-xs text-white/80">
              Your fine-tune does not begin until this payment is completed.
            </p>

            <div className="flex flex-col gap-y-2">
              <p className="text-white/80 font-medium">
                Reference: <span className="font-normal">{settings.jobId}</span>
              </p>
              <p className="text-xs text-white/80">
                This reference id is how we will communicate with you about your
                fine-tune training status. <b>Save this reference id.</b>
              </p>
            </div>

            <div className="flex flex-col gap-y-2">
              <p className="text-white/80 font-medium">
                Contact: <span className="font-normal">{settings.email}</span>
              </p>
              <p className="text-xs text-white/80">
                Check the email above for order confirmation, status updates,
                and more. Mintplex Labs will only contact you about your order
                via email.
              </p>
            </div>

            <div className="flex flex-col items-left gap-x-4 text-xs">
              <a
                href="https://docs.anythingllm.com/fine-tuning/overview"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 hover:underline hover:cursor-pointer"
              >
                Documentation
              </a>
              <a
                href="mailto:team@mintplexlabs.com"
                className="text-sky-400 hover:underline hover:cursor-pointer"
              >
                Contact support
              </a>
            </div>

            <p className="text-xs text-white/80">
              You can close this window or navigate away once you see the
              confirmation email in your inbox.
            </p>
          </div>

          <CTAButton
            className="text-dark-text w-full mt-[18px] h-[34px] hover:bg-accent"
            onClick={() => (window.location.href = paths.home())}
          >
            Finish
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
