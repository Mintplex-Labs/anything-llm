import useSessionId from "@/hooks/useSessionId";

export default function SessionId() {
  const sessionId = useSessionId();
  if (!sessionId) return null;

  return (
    <div className="allm-text-xs allm-text-gray-300 allm-w-full allm-text-center">
      {sessionId}
    </div>
  );
}
