export default function Sponsor({ settings }) {
  if (!!settings.noSponsor) return null;

  return (
    <div className="flex w-full items-center justify-center">
      <a
        href={settings.sponsorLink ?? "#"}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-gray-300 hover:text-blue-300 hover:underline"
      >
        {settings.sponsorText}
      </a>
    </div>
  );
}
