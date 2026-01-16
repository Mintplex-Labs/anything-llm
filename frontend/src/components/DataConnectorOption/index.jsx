export default function DataConnectorOption({ slug }) {
  if (!DATA_CONNECTORS.hasOwnProperty(slug)) return null;
  const { path, image, name, description, link } = DATA_CONNECTORS[slug];

  return (
    <a href={path}>
      <label className="transition-all duration-300 inline-flex flex-col h-full w-60 cursor-pointer items-start justify-between rounded-2xl bg-preference-gradient light:bg-theme-bg-container border-2 border-transparent shadow-md px-5 py-4 text-white light:text-theme-text-primary hover:bg-selected-preference-gradient light:hover:bg-theme-bg-secondary hover:border-white/60 light:hover:border-theme-modal-border peer-checked:border-white light:peer-checked:border-primary-button light:border-theme-modal-border peer-checked:border-opacity-90 peer-checked:bg-selected-preference-gradient light:peer-checked:bg-theme-bg-secondary">
        <div className="flex items-center">
          <img src={image} alt={name} className="h-10 w-10 rounded" />
          <div className="ml-4 text-sm font-semibold">{name}</div>
        </div>
        <div className="mt-2 text-xs font-base text-white light:text-theme-text-primary tracking-wide">
          {description}
        </div>
        <a
          href={link}
          target="_blank"
          className="mt-2 text-xs text-white light:text-theme-text-primary font-medium underline"
        >
          {link}
        </a>
      </label>
    </a>
  );
}
