import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import System from "@/models/system";
import Toggle from "@/components/lib/Toggle";

/**
 * Anonymous telemetry opt-out toggle. Turning it off sends the
 * `telemetry_disabled` event server-side before telemetry is disabled.
 * @param {Object} props
 * @param {boolean} [props.verbose=false] - Show the full explanation instead of the one-line hint
 */
export default function TelemetryToggle({ verbose = false }) {
  const [loading, setLoading] = useState(true);
  const [telemetry, setTelemetry] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchSettings() {
      const settings = await System.keys();
      setTelemetry(settings?.DisableTelemetry !== "true");
      setLoading(false);
    }
    fetchSettings();
  }, []);

  async function toggleTelemetry() {
    await System.updateSystem({
      DisableTelemetry: !telemetry ? "false" : "true",
    });
    setTelemetry(!telemetry);
  }

  if (loading) return null;
  return (
    <div className="relative w-full max-w-2xl">
      <Toggle
        size="lg"
        className="mb-2"
        label={t("privacy.anonymous")}
        enabled={telemetry}
        onChange={toggleTelemetry}
      />
      {verbose ? <LongDescription /> : <ShortDescription />}
    </div>
  );
}

const EVENTS_URL =
  "https://github.com/search?q=repo%3AMintplex-Labs%2Fanything-llm%20.sendTelemetry(&type=code";

function ShortDescription() {
  return (
    <p className="text-theme-text-secondary text-sm">
      Anonymous usage events, like which features and providers you use. Never
      your chats, documents, API keys, or IP address.{" "}
      <a
        href={EVENTS_URL}
        className="underline text-blue-400"
        target="_blank"
        rel="noreferrer"
      >
        See every event we track
      </a>
      .
    </p>
  );
}

function LongDescription() {
  return (
    <div className="flex flex-col items-left space-y-2">
      <p className="text-theme-text-secondary text-xs rounded-lg max-w-[24rem]">
        All events do not record IP-address and contain <b>no identifying</b>{" "}
        content, settings, chats, or other non-usage based information. To see
        the list of event tags collected you can look on{" "}
        <a
          href={EVENTS_URL}
          className="underline text-blue-400"
          target="_blank"
          rel="noreferrer"
        >
          GitHub here
        </a>
        .
      </p>
      <p className="text-theme-text-secondary text-xs rounded-lg max-w-[24rem]">
        As an open-source project we respect your right to privacy. We are
        dedicated to building the best solution for integrating AI and documents
        privately and securely. If you do decide to turn off telemetry all we
        ask is to consider sending us feedback and thoughts so that we can
        continue to improve AnythingLLM for you.{" "}
        <a
          href="mailto:team@mintplexlabs.com"
          className="underline text-blue-400"
          target="_blank"
          rel="noreferrer"
        >
          team@mintplexlabs.com
        </a>
        .
      </p>
    </div>
  );
}
