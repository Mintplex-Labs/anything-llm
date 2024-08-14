import { CheckCircle, XCircle } from "@phosphor-icons/react";
import FineTuningSteps from "..";

export default function Introduction({ setSettings, setStep }) {
  const handleAccept = () => {
    setSettings((prev) => {
      return { ...prev, agreedToTerms: true };
    });
    setStep(FineTuningSteps.intro.next());
  };

  return (
    <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
      <div className="bg-[#303237] text-white rounded-xl flex-1 p-4">
        <div className="w-full flex flex-col gap-y-4">
          <h2 className="text-xl text-white font-semibold">
            What is a "Fine-Tuned" model?
          </h2>
          <div className="flex flex-col gap-y-2 text-white/80">
            <p>
              Fine-tuned models are basically "customized"
              Language-Learning-Models (LLMs). These can be based on popular
              open-source <b>foundational</b> models like LLama3 8B or even some
              closed source models like GPT-3.5.
            </p>
            <p>
              Typically, you would use an open-source model - you probably are
              using one right now with AnythingLLM!
            </p>
            <p>
              When you create a custom fine-tune with AnythingLLM we will train
              a custom base model on your specific data already inside of this
              AnythingLLM instance and give you back a <code>GGUF</code> file
              you can then load back into tools like Ollama, LMStudio, and
              anywhere else you use local LLMs.
            </p>
          </div>

          <div className="flex flex-col gap-y-2 text-white/80">
            <h3 className="text-lg text-white font-semibold">
              When should I get a fine-tuned model?
            </h3>
            <p>
              Fine-tuned models are perfect for when you need any of the
              following
            </p>
            <ul className="flex flex-col gap-y-1">
              <li className="flex items-center gap-x-1">
                <CheckCircle className="text-green-300" /> Setting the style,
                tone, format, or other qualitative aspects without prompting
              </li>
              <li className="flex items-center gap-x-1">
                <CheckCircle className="text-green-300" /> Improving reliability
                at producing a desired output
              </li>
              <li className="flex items-center gap-x-1">
                <CheckCircle className="text-green-300" /> Correcting failures
                to follow complex prompts, citations, or lack of background
                knowledge
              </li>
              <li className="flex items-center gap-x-1">
                <CheckCircle className="text-green-300" /> You want to run this
                model privately or offline
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-y-2 text-white/80">
            <h3 className="text-lg text-white font-semibold">
              What are fine-tunes bad for?
            </h3>
            <p>
              Fine-tuned models powerful, but they are not the "silver bullet"
              to any issues you have with RAG currently. Some notable
              limitations are
            </p>
            <ul>
              <li className="flex items-center gap-x-1">
                <XCircle className="text-red-300" /> You need perfect recall of
                some piece of literature or reference document
              </li>
              <li className="flex items-center gap-x-1">
                <XCircle className="text-red-300" /> You want your model to have
                perfect memory or recollection
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-y-2 text-white/80">
            <p>
              In summary, if you are getting good results with RAG currently,
              creating a fine-tune can squeeze <b>even more performance</b> out
              of a model. Fine-Tunes are for improving response quality and
              general responses, but they are <b>not for knowledge recall</b> -
              that is what RAG is for! Together, it is a powerful combination.
            </p>
          </div>
        </div>

        <button
          onClick={handleAccept}
          type="button"
          className="mt-8 w-full py-2 text-center text-white hover:bg-primary-button border-none rounded-lg"
        >
          Start a fine-tune &rarr;
        </button>
      </div>
    </div>
  );
}
