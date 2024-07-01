export default function Sponsor({ settings }) {
  if (!!settings.noSponsor) return null;

  return (
    <div className="allm-flex allm-w-full allm-items-center allm-justify-center">
      <a
        style={{ color: "#0119D9" }}
        href={settings.sponsorLink ?? "#"}
        target="_blank"
        rel="noreferrer"
        className="allm-text-xs allm-font-sans hover:allm-opacity-80 hover:allm-underline"
      >
        {settings.sponsorText}
      </a>
    </div>
  );
}
