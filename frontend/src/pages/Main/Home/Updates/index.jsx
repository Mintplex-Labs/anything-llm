import { news } from './news';

export default function Updates() {
  return (
    <div>
      <h1 className="text-white uppercase text-sm font-semibold mb-6">
        Updates
      </h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((item) => (
          <UpdateCard
            key={item.id}
            thumbnail_url={item.thumbnail_url}
            title={item.title}
            subtitle={item.short_description}
            source={item.source}
            date={item.date}
            goto={item.goto}
          />
        ))}
      </div>
    </div>
  );
}

function UpdateCard({ thumbnail_url, title, subtitle, source, date, goto }) {
  return (
    <a href={goto} target="_blank" rel="noopener noreferrer" className="block">
      <div className="bg-[#1C1C1C] rounded-xl p-4 flex gap-x-4 hover:bg-[#252525] transition-colors">
        <img src={thumbnail_url} alt={title} className="w-[80px] h-[80px] rounded-lg flex-shrink-0 object-cover" />
        <div className="flex flex-col gap-y-1">
          <p className="text-[#9F9FA0] text-xs">{source}</p>
          <h3 className="text-white font-medium text-sm">{title}</h3>
          <p className="text-[#9F9FA0] text-xs line-clamp-2">{subtitle}</p>
          <div className="flex items-center gap-x-4 text-xs text-[#9F9FA0]">
            <span className="text-[#53B1FD]">{source}</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
