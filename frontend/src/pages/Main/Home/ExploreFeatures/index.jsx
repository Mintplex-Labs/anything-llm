export default function ExploreFeatures() {
  return (
    <div>
      <h1 className="text-white uppercase text-sm font-semibold mb-6">
        Explore our features
      </h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard
          title="Utilize Agent Skills"
          description="Enabling powerful automation and workflow extensions for your specific needs."
          primaryAction={<>Chat with Agent</>}
          secondaryAction={<>Build Agent Flow</>}
          isNew={true}
        />
        <FeatureCard
          title="Slash Commands"
          description="Enabling powerful automation and workflow extensions for your specific needs."
          primaryAction={<>Set Slash Command</>}
          secondaryAction={<>Explore on Hub</>}
          isNew={true}
        />
        <FeatureCard
          title="System Prompts"
          description="Enabling powerful automation and workflow extensions for your specific needs."
          primaryAction={<>Set up System Prompt</>}
          secondaryAction={<>Explore on Hub</>}
          isNew={true}
        />
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  primaryAction,
  secondaryAction,
  isNew,
}) {
  return (
    <div className="border border-white/20 rounded-lg py-4 px-5 flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-white font-semibold flex items-center gap-x-2">
          {title}
        </h2>
        <p className="text-[#9F9FA0] text-sm">{description}</p>
      </div>
      <div className="flex flex-col gap-y-[10px]">
        <button className="w-full h-[36px] bg-[#36BFFA] rounded-lg text-black text-sm font-medium flex items-center justify-center gap-x-2.5">
          {primaryAction}
        </button>
        <div className="relative w-full">
          {isNew && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 border border-[#3F3F42] px-2 font-semibold rounded-md text-[10px] text-white">
              New
            </div>
          )}
          <button className="w-full h-[36px] bg-[#27282A] rounded-lg text-white text-sm font-medium flex items-center justify-center">
            {secondaryAction}
          </button>
        </div>
      </div>
    </div>
  );
}
