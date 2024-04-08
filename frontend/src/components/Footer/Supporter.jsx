import { useModal } from "@/hooks/useModal";
import { HandCoins, X } from "@phosphor-icons/react";
import ModalWrapper from "../ModalWrapper";

const SUPPORTER_LINK = import.meta.env.DEV
  ? "https://buy.stripe.com/test_3csfZUbXIaYD6Mo148"
  : "https://buy.stripe.com/dR614O1xc8cu9r23cc";

export default function SupporterLink() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="transition-all duration-300 flex w-fit h-fit p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
        aria-label="Support AnythingLLM's development"
      >
        <HandCoins weight="fill" className="h-5 w-5 " />
      </button>
      <ModalWrapper isOpen={isOpen}>
        <div className="relative w-full md:max-w-2xl max-h-full bg-main-gradient rounded-lg shadow p-4">
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-5 right-5 text-white border-none text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          >
            <X className="text-gray-300 text-lg" />
          </button>

          <div className="flex flex-col gap-y-4 w-full p-6 text-center">
            <p className="font-semibold text-white text-xl">
              Support the development of AnythingLLM!
            </p>

            <div className="flex flex-col gap-y-2  mt-4 ">
              <p className="text-sm text-white/80">
                By making a one-time, "pay what you want" supporter payment, you
                can contribute to the continuous development of AnythingLLM
                Desktop.
              </p>
              <p className="text-sm text-white/80 font-bold">
                This payment is entirely optional and is not obligatory for
                using AnythingLLM Desktop.
              </p>
              <p className="text-sm text-white/80 italic">
                Please note that making a supporter payment does not grant you
                access to additional services, guarantees, or features. It
                simply aids us in sustaining the development of AnythingLLM
                Desktop and ensuring its availability as a free application.
              </p>
              <p className="text-sm text-white/80">
                Your support is greatly appreciated!
              </p>
            </div>

            <div className="flex flex-col w-full justify-center items-center mt-4 gap-y-1">
              <a
                onClick={closeModal}
                href={SUPPORTER_LINK}
                target="_blank"
                rel="noreferrer"
                className="mt-2 text-base font-base w-fit border border-slate-200 bg-white px-4 py-2 rounded-md items-center flex gap-x-2 text-slate-800 hover:bg-gray-200"
              >
                Support AnythingLLM Desktop
              </a>
              <p className="text-[10px] text-white/60">
                this will open a Stripe checkout page in a new window.
              </p>
              <p className="text-[10px] text-white/60">
                payment portal may not be available depending on your geographic
                location and local laws.
              </p>
            </div>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}
