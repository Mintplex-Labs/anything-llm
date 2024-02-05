import useSessionId from "@/hooks/useSessionId";

export default function SessionId() {
  const sessionId = useSessionId();
  if (!sessionId) return null;

  return (
    <div className="text-xs text-gray-300 w-full text-center">{sessionId}</div>
  );
}
