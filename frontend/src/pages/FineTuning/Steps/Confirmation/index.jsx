import FineTuning from "@/models/experimental/fineTuning";
import { dollarFormat } from "@/utils/numbers";
import showToast from "@/utils/toast";
import { CheckCircle } from "@phosphor-icons/react";
import { useState } from "react";
import FineTuningSteps from "../index";

/**
 * @param {{settings: import("../index").OrderSettings}} param0
 * @returns
 */
export default function Confirmation({ settings, setSettings, setStep }) {
  const [loading, setLoading] = useState(false);
  async function handleCheckout() {
    setLoading(true);
    const data = await FineTuning.createOrder({
      email: settings.email,
      baseModel: settings.baseModel,
      modelName: settings.modelName,
      trainingData: {
        slugs: settings.trainingData.slugs,
        feedback: settings.trainingData.feedback,
      },
    });

    if (!data) {
      setLoading(false);
      showToast("Could not generate new order.", "error", { clear: true });
      return;
    }

    window.open(data.checkoutUrl, "_blank");
    setSettings((prev) => {
      return {
        ...prev,
        jobId: data.jobId,
        checkoutUrl: data.checkoutUrl,
      };
    });
    setStep(FineTuningSteps.confirmation.next());
  }

  return (
    <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
      <div className="bg-[#303237] text-white rounded-xl flex-1 p-4 flex flex-col justify-between">
        <div className="w-full flex flex-col gap-y-4">
          <h2 className="text-xl text-white font-semibold">Confirm & Submit</h2>
          <p>
            Below are your fine-tuning order details. If you have any questions
            before or after ordering your fine-tune you can{" "}
            <a
              href="https://docs.useanything.com/fine-tuning/overview"
              target="_blank"
              className="underline"
            >
              checkout the fine-tuning FAQ
            </a>{" "}
            or email{" "}
            <a className="underline" href="mailto:team@mintplexlabs.com">
              team@mintplexlabs.com
            </a>
            .
          </p>
          <div className="p-2 bg-zinc-800 text-white font-mono flex flex-col gap-y-2 h-full rounded-lg">
            <div className="flex items-center gap-x-1 text-sm">
              <p className="">Contact e-mail:</p>
              <p className="font-thin">{settings.email}</p>
            </div>
            <div className="flex items-center gap-x-1 text-sm">
              <p className="">Base LLM:</p>
              <p className="font-thin">{settings.baseModel}</p>
            </div>
            <div className="flex items-center gap-x-1 text-sm">
              <p className="">Output model name:</p>
              <p className="font-thin">"{settings.modelName}"</p>
            </div>
            <div className="flex flex-col gap-y-1 text-sm">
              <div className="flex items-center gap-x-1">
                <p className="">Training on workspaces:</p>
                {settings.trainingData.slugs.map((slug, i) => {
                  return (
                    <p key={slug} className="font-thin">
                      "{slug}"
                      {i !== settings.trainingData.slugs.length - 1 ? "," : ""}
                    </p>
                  );
                })}
              </div>
              {settings.trainingData.feedback === true ? (
                <p className="underline">
                  training on <b>positive-feedback chats only</b>.
                </p>
              ) : (
                <p className="underline">
                  training on <b>all chats</b>.
                </p>
              )}
            </div>

            <br />
            <div className="flex items-center gap-x-1 text-sm">
              <CheckCircle className="text-green-300" />
              <p className="font-thin">Agreed to Terms and Conditions</p>
            </div>
            <div className="flex items-center gap-x-1 text-sm">
              <CheckCircle className="text-green-300" />
              <p className="font-thin">Understand privacy & data handling</p>
            </div>
            <div className="flex items-center gap-x-1 text-sm">
              <CheckCircle className="text-green-300" />
              <p className="font-thin">Agreed to Fulfillment terms</p>
            </div>

            <div>
              <div className="flex items-center gap-x-1 text-lg border-t-[2px] border-white/40 pt-2 mb-0">
                <p className="">Total one-time cost:</p>
                <p className="font-thin">
                  {dollarFormat(settings.tuningInfo.pricing.usd)}
                  <sup>*</sup>
                </p>
              </div>
              <p className="m-0 p-0 text-xs text-white/60 font-mono">
                <sup>*</sup> price does not include any coupons, incentives, or
                discounts you can apply at checkout.
              </p>
            </div>
          </div>
          <p>
            Once you proceed to checkout, if you do not complete this purchase
            your data will be deleted from our servers within 1 hour of
            abandonment of the creation of the checkout in accordance to our
            privacy and data handling policy.
          </p>
        </div>

        <button
          disabled={loading}
          onClick={handleCheckout}
          type="button"
          className="mt-8 w-full py-2 text-center text-black bg-white hover:bg-white/80 border-none rounded-lg"
        >
          {loading ? <>Generating order...</> : <>Start Training &rarr;</>}
        </button>
      </div>
    </div>
  );
}
