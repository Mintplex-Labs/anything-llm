// TEMPORARY: dummy live cards for tuning the in-chat UI. Delete with demo-frame.jpg once done.
import { LiveCard } from ".";
import demoFrame from "./demo-frame.jpg";

const RUNNING = {
  sessionId: "demo-running",
  status: "running",
  stepCount: 2,
  tokens: { total: 0 },
  step: {
    url: "https://www.microcenter.com/",
    favicon: "https://www.microcenter.com/favicon.ico",
    label: "Searching for AMD Ryzen 7 9800X3D",
  },
};

const NEEDS_HELP = {
  ...RUNNING,
  sessionId: "demo-needs-help",
  status: "needs-help",
  step: { ...RUNNING.step, label: "Asking you for help" },
  question:
    'microcenter.com wants to check that you are human. Click "Take control" in the session card, complete the check, then press Continue.',
};

const noop = () => {};

export default function BrowserUseSessionDemo() {
  return (
    <>
      <LiveCard
        session={RUNNING}
        frameSrc={demoFrame}
        stopping={false}
        onStop={noop}
        onInput={noop}
        onReply={() => true}
      />
      <LiveCard
        session={NEEDS_HELP}
        frameSrc={demoFrame}
        stopping={false}
        onStop={noop}
        onInput={noop}
        onReply={() => true}
      />
    </>
  );
}
