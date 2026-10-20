/** The frame every browser session card sits in, sized like the chat's other cards. */
export default function CardShell({ children }) {
  return (
    <div className="flex justify-center w-full my-2">
      <div className="w-full max-w-[750px] mr-4 overflow-hidden rounded-xl bg-zinc-800 light:bg-slate-100 light:border light:border-slate-200/50">
        {children}
      </div>
    </div>
  );
}
