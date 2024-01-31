import useSessionId from "@/hooks/useSessionId";

export default function SessionId() {
  const sessionId = useSessionId();
  if (!sessionId) return null;

  return (
    <div className="text-xs text-gray-500 w-full text-center">
      ID: {sessionId}
    </div>
  );
}
