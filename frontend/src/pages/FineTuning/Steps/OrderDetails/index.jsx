import FineTuning from "@/models/experimental/fineTuning";
import { useEffect, useState } from "react";
import FineTuningSteps from "..";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr";

export default function OrderDetails({ setSettings, setStep }) {
  const [info, setInfo] = useState({});
  useEffect(() => {
    FineTuning.info()
      .then((res) => {
        setInfo(res);
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
      <div className="bg-[#303237] text-white rounded-xl flex-1 p-4">
        <form onSubmit={handleSubmit}>
          <div className="w-full flex flex-col gap-y-4">
            <h2 className="text-xl text-white font-semibold">
              Time to create your fine tune!
            </h2>
            <p>
              Creating a model is quite simple. Currently we have a limited base
              model selection, however in the future we plan to expand support
              to many more foundational models.
            </p>

            <div className="flex flex-col pr-10">
              <div className="flex flex-col gap-y-1 mb-4">
                <label className="text-white text-sm font-bold">
                  Account e-mail
                </label>
                <p className="text-xs font-normal text-white/80">
                  This e-mail is where you will receive all order information
                  and updates. This e-mail <b>must be accurate</b> or else we
                  won't be able to contact you with your fine-tuned model!
                </p>
              </div>
              <input
                type="email"
                name="email"
                className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="jdoe@example.com"
                required={true}
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <div className="flex flex-col pr-10">
              <div className="flex flex-col gap-y-1 mb-4">
                <label className="text-white text-sm font-bold">
                  Preferred Base Model
                </label>
                <p className="text-xs font-normal text-white/80">
                  This is the foundational model your fine-tune will be based
                  on. We recommend Llama 3 8B.
                </p>
              </div>
              {info.hasOwnProperty("availableBaseModels") ? (
                <select
                  name="baseModel"
                  required={true}
                  className="border-none bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-fit p-2.5"
                >
                  <option disabled="true" selected="true" value="">
                    -- select a base model --
                  </option>
                  <optgroup label="Available base models">
                    {(info?.availableBaseModels || []).map((model) => {
                      return (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      );
                    })}
                  </optgroup>
                </select>
              ) : (
                <div className="flex items-center gap-x-2 text-white/80 text-sm">
                  <CircleNotch className="animate-spin" size={12} />
                  <p>fetching available models...</p>
                </div>
              )}
            </div>

            <div className="flex flex-col pr-10">
              <div className="flex flex-col gap-y-1 mb-4">
                <label className="text-white text-sm font-bold">
                  Model name
                </label>
                <p className="text-xs font-normal text-white/80">
                  What would you like to call your model? This has no impact on
                  its output or training and is only used for how we communicate
                  with you about the model.
                </p>
              </div>
              <input
                type="text"
                name="modelName"
                className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="My really cool model!"
                required={true}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-8 w-full py-2 text-center text-white hover:bg-primary-button border-none rounded-lg"
          >
            Proceed to data selection &rarr;
          </button>
        </form>
      </div>
    </div>
  );
}
