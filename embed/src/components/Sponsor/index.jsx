export default function Sponsor({ settings }) {
  if (!!settings.noSponsor) return null;

  return (
    <div className="flex w-full items-center justify-center">
      <a
        href={settings.sponsorLink ?? "#"}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-[#0119D9] hover:text-[#0119D9]/80 hover:underline"
      >
        {settings.sponsorText}
      </a>
    </div>
  );
}
