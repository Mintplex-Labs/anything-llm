export default function UsersTable({
  title,
  description,
  users = [],
  isPending = false,
  onApprove,
  onDeny,
  onRevoke,
}) {
  if (isPending && users.length === 0) return null;
  const colCount = isPending ? 4 : 3;

  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-sm font-semibold text-theme-text-primary">{title}</p>
      <p className="text-xs text-theme-text-secondary">{description}</p>
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-xs text-left rounded-lg min-w-[480px] border-spacing-0">
          <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">
                User
              </th>
              <th scope="col" className="px-6 py-3">
                Chat ID
              </th>
              {isPending && (
                <th scope="col" className="px-6 py-3">
                  Pairing Code
                </th>
              )}
              <th scope="col" className="px-6 py-3">
                {" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr className="bg-transparent text-theme-text-secondary text-sm font-medium">
                <td colSpan={colCount} className="px-6 py-4 text-center">
                  {isPending ? "No pending requests" : "No approved users"}
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const chatId = typeof user === "string" ? user : user.chatId;
                const username = user.telegramUsername || user.username || null;
                const firstName = user.firstName || null;
                const displayName = username
                  ? `@${username}`
                  : firstName || "Unknown";
                const code = user.code;
                return (
                  <tr
                    key={chatId}
                    className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-10"
                  >
                    <td className="px-6 whitespace-nowrap">
                      <span className="text-sm text-theme-text-primary">
                        {displayName}
                      </span>
                    </td>
                    <td className="px-6 whitespace-nowrap">
                      <span className="text-sm text-theme-text-secondary">
                        {chatId}
                      </span>
                    </td>
                    {isPending && (
                      <td className="px-6 whitespace-nowrap">
                        <code className="bg-theme-bg-primary px-2 py-1 rounded text-theme-text-primary font-mono text-sm">
                          {code}
                        </code>
                      </td>
                    )}
                    <td className="px-6 flex items-center gap-x-6 h-full mt-1">
                      {isPending ? (
                        <>
                          <ActionButton
                            onClick={() => onApprove(chatId)}
                            className="hover:light:bg-green-50 hover:light:text-green-500 hover:text-green-300"
                          >
                            Approve
                          </ActionButton>
                          <ActionButton
                            onClick={() => onDeny(chatId)}
                            className="hover:light:bg-red-50 hover:light:text-red-500 hover:text-red-300"
                          >
                            Deny
                          </ActionButton>
                        </>
                      ) : (
                        <ActionButton
                          onClick={() => onRevoke(chatId)}
                          className="hover:light:bg-red-50"
                        >
                          Revoke
                        </ActionButton>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionButton({ onClick, className = "", children }) {
  return (
    <button
      onClick={onClick}
      className={`border-none flex items-center justify-center text-xs font-medium text-white/80 light:text-black/80 rounded-lg p-1 hover:bg-white hover:bg-opacity-10 ${className}`}
    >
      {children}
    </button>
  );
}
