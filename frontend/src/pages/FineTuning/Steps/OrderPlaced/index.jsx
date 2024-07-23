export default function OrderPlaced({ settings }) {
  return (
    <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
      <div className="bg-[#303237] text-white rounded-xl flex-1 p-4">
        <div className="w-full flex flex-col gap-y-4">
          <h2 className="text-xl text-white font-semibold">
            Your order is placed!
          </h2>

          <div className="">
            <p>
              Your fine-tune will begin once payment is complete. If the payment
              window did not automatically open - your checkout link is below.
            </p>
            <a
              href={settings.checkoutUrl}
              target="_blank"
              className="text-xs font-mono text-white/60 underline"
            >
              {new URL(settings.checkoutUrl).origin}
            </a>
            <p className="text-xs font-mono text-white/80">
              Your fine-tune does not begin until this payment is completed.
            </p>
          </div>

          <div className="">
            <p className="font-mono text-white/80 text-sm">
              Reference: {settings.jobId}
            </p>
            <p className="text-xs font-mono text-white/80">
              This reference id is how we will communicate with you about your
              fine-tune training status. <b>Save this reference id.</b>
            </p>
          </div>

          <div className="">
            <p className="font-mono text-white/80 text-sm">
              Contact: {settings.email}
            </p>
            <p className="text-xs font-mono text-white/80">
              Check the email above for order confirmation, status updates, and
              more. Mintplex Labs will only contact you about your order via
              email.
            </p>
          </div>

          <div className="font-mono text-white/80 text-sm flex items-center gap-x-2">
            <a
              href="https://docs.useanything.com/fine-tuning/overview"
              target="_blank"
              className="underline"
            >
              Documentation
            </a>
            <a href="mailto:team@mintplexlabs.com" className="underline">
              Contact support
            </a>
          </div>

          <p className="text-xs font-mono text-white/80">
            You can close this window or navigate away once you see the
            confirmation email in your inbox.
          </p>
        </div>
      </div>
    </div>
  );
}
