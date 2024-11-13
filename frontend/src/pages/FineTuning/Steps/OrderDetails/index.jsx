import FineTuning from "@/models/experimental/fineTuning";
import { useEffect, useState } from "react";
import FineTuningSteps from "..";
import { CircleNotch } from "@phosphor-icons/react";
import CTAButton from "@/components/lib/CTAButton";

export default function OrderDetails({ setSettings, setStep }) {
  const [info, setInfo] = useState({});

  useEffect(() => {
    FineTuning.info()
      .then((res) => {
        setInfo(res ?? {});
        setSettings((prev) => {
          return { ...prev, tuningInfo: res };
        });
      })
      .catch(() => setInfo({}));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    setSettings((prev) => {
      return {
        ...prev,
        email: form.get("email"),
        baseModel: form.get("baseModel"),
        modelName: form.get("modelName"),
      };
    });
    setStep(FineTuningSteps["order-details"].next());
  }

  return (
    <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
      <div className="bg-theme-bg-secondary rounded-xl flex-1 p-6">
        <div className="w-full flex flex-col gap-y-3 max-w-[700px]">
          <h2 className="text-base text-theme-text-primary font-semibold">
            Time to create your fine tune!
          </h2>
          <p className="text-theme-text-secondary text-sm">
            Creating a model is quite simple. Currently we have a limited base
            model selection, however in the future we plan to expand support to
            many more foundational models.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-6 mt-4">
            <div className="flex flex-col">
              <label className="text-theme-text-primary text-sm font-semibold block mb-3">
                Account e-mail
              </label>
              <p className="text-xs font-normal text-theme-text-secondary mb-2">
                This e-mail is where you will receive all order information and
                updates. This e-mail <b>must be accurate</b> or else we won't be
                able to contact you with your fine-tuned model!
              </p>
              <input
                type="email"
                name="email"
                className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="jdoe@example.com"
                required={true}
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-theme-text-primary text-sm font-semibold block mb-3">
                Preferred Base Model
              </label>
              <p className="text-xs font-normal text-theme-text-secondary mb-2">
                This is the foundational model your fine-tune will be based on.
                We recommend Llama 3 8B.
              </p>
              {info.hasOwnProperty("availableBaseModels") ? (
                <select
                  name="baseModel"
                  required={true}
                  className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                >
                  <option disabled value="">
                    -- select a base model --
                  </option>
                  <optgroup label="Available base models">
                    {(info?.availableBaseModels || []).map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </optgroup>
                </select>
              ) : (
                <div className="flex items-center gap-x-2 text-theme-text-secondary text-sm">
                  <CircleNotch className="animate-spin" size={12} />
                  <p>fetching available models...</p>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-theme-text-primary text-sm font-semibold block mb-3">
                Model name
              </label>
              <p className="text-xs font-normal text-theme-text-secondary mb-2">
                What would you like to call your model? This has no impact on
                its output or training and is only used for how we communicate
                with you about the model.
              </p>
              <input
                type="text"
                name="modelName"
                className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="My really cool model!"
                required={true}
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <CTAButton
              type="submit"
              className="text-dark-text w-full mt-[18px] h-[34px] hover:bg-accent"
            >
              Proceed to data selection &rarr;
            </CTAButton>
          </form>
        </div>
      </div>
    </div>
  );
}
