export default function Updates() {
  return (
    <div>
      <h1 className="text-white uppercase text-sm font-semibold mb-6">
        Updates
      </h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UpdateCard
          author="John Smith"
          title="Long Article Title Goes Here"
          subtitle="Long Article Title Goes Here..."
          source="NVIDIA"
          date="January 9, 2023"
        />
        <UpdateCard
          author="John Smith"
          title="Long Article Title Goes Here"
          subtitle="Long Article Title Goes Here..."
          source="NVIDIA"
          date="January 9, 2023"
        />
        <UpdateCard
          author="John Smith"
          title="Long Article Title Goes Here"
          subtitle="Long Article Title Goes Here..."
          source="NVIDIA"
          date="January 9, 2023"
        />
      </div>
    </div>
  );
}

function UpdateCard({ author, title, subtitle, source, date }) {
  return (
    <div className="bg-[#1C1C1C] rounded-xl p-4 flex gap-x-4">
      <div className="w-[80px] h-[80px] bg-[#27282A] rounded-lg flex-shrink-0" />
      <div className="flex flex-col gap-y-1">
        <p className="text-[#9F9FA0] text-xs">{author}</p>
        <h3 className="text-white font-medium text-sm">{title}</h3>
        <div className="flex items-center gap-x-4 text-xs text-[#9F9FA0]">
          <span className="text-[#53B1FD]">{source}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}
