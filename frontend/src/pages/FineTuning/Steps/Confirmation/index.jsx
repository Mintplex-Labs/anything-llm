import FineTuning from "@/models/experimental/fineTuning";
import { dollarFormat } from "@/utils/numbers";
import showToast from "@/utils/toast";
import { Check } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import FineTuningSteps from "../index";
import CTAButton from "@/components/lib/CTAButton";
import Workspace from "@/models/workspace";

/**
 * @param {{settings: import("../index").OrderSettings}} param0
 * @returns
 */
export default function Confirmation({ settings, setSettings, setStep }) {
  const [loading, setLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    Workspace.all()
      .then((fetchedWorkspaces) => {
        setWorkspaces(fetchedWorkspaces);
      })
      .catch(() => {
        showToast("Failed to fetch workspaces", "error");
      });
  }, []);

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

  const getWorkspaceName = (slug) => {
    const workspace = workspaces.find((ws) => ws.slug === slug);
    return workspace ? workspace.name : slug;
  };

  return (
    <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
      <div className="bg-[#303237] text-white rounded-xl flex-1 p-6">
        <div className="w-full flex flex-col gap-y-3 max-w-[700px]">
          <h2 className="text-base text-white font-semibold">
            Confirm & Submit
          </h2>
          <p className="text-white/80 text-sm">
            Below are your fine-tuning order details. If you have any questions
            before or after ordering your fine-tune you can checkout the{" "}
            <a
              href="https://docs.useanything.com/fine-tuning/overview"
              target="_blank"
              rel="noreferrer"
              className="underline text-sky-400"
            >
              fine-tuning FAQ
            </a>{" "}
            or email{" "}
            <a
              className="underline text-sky-400"
              href="mailto:team@mintplexlabs.com"
            >
              team@mintplexlabs.com
            </a>
            .
          </p>
          <div className="p-4 bg-zinc-900 text-white flex flex-col gap-y-2 rounded-lg mt-4">
            <div className="flex flex-col gap-y-3 text-sm">
              <div className="flex items-start gap-x-1">
                <p className="w-1/3">Contact e-mail:</p>
                <p className="text-white/80 w-2/3">{settings.email}</p>
              </div>
              <div className="flex items-start gap-x-1">
                <p className="w-1/3">Base LLM:</p>
                <p className="text-white/80 w-2/3">{settings.baseModel}</p>
              </div>
              <div className="flex items-start gap-x-1">
                <p className="w-1/3">Output model name:</p>
                <p className="text-white/80 w-2/3">"{settings.modelName}"</p>
              </div>
              <div className="flex items-start gap-x-1">
                <p className="w-1/3">Training on workspaces:</p>
                <div className="text-white/80 w-2/3 flex flex-wrap gap-1">
                  {settings.trainingData.slugs.map((slug, i) => (
                    <span
                      key={slug}
                      className={`rounded-full bg-white/10 px-2 py-0.5 h-[20px] text-xs font-medium text-white shadow-sm`}
                    >
                      {getWorkspaceName(slug)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-x-1">
                <p className="w-1/3">Training data:</p>
                <p className="text-white/80 w-2/3">
                  {settings.trainingData.feedback === true
                    ? "Training on positive-feedback chats only"
                    : "Training on all chats"}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <ul className="flex flex-col gap-y-1 text-sm">
                <li className="flex items-center gap-x-2">
                  <Check className="text-white" size={12} weight="bold" />
                  <p className="text-white/80">
                    Agreed to Terms and Conditions
                  </p>
                </li>
                <li className="flex items-center gap-x-2">
                  <Check className="text-white" size={12} weight="bold" />
                  <p className="text-white/80">
                    Understand privacy & data handling
                  </p>
                </li>
                <li className="flex items-center gap-x-2">
                  <Check className="text-white" size={12} weight="bold" />
                  <p className="text-white/80">Agreed to Fulfillment terms</p>
                </li>
              </ul>
            </div>

            <div className="mt-4 border-white/40 pt-2">
              <div className="flex items-center gap-x-1 text-lg mb-0">
                <p className="">Total one-time cost:</p>
                <p className="text-white/80">
                  {dollarFormat(settings.tuningInfo.pricing.usd)}
                  <sup>*</sup>
                </p>
              </div>
              <p className="m-0 p-0 text-xs text-white/60">
                <sup>*</sup> price does not include any coupons, incentives, or
                discounts you can apply at checkout.
              </p>
            </div>
          </div>
          <p className="text-xs text-white/80 mt-4">
            Once you proceed to checkout, if you do not complete this purchase
            your data will be deleted from our servers within 1 hour of
            abandonment of the creation of the checkout in accordance to our
            privacy and data handling policy.
          </p>
          <CTAButton
            disabled={loading}
            onClick={handleCheckout}
            className="text-dark-text w-full mt-[18px] h-[34px] hover:bg-accent"
          >
            {loading ? "Generating order..." : "Start Training →"}
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
