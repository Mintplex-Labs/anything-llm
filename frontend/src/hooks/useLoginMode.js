import { AUTH_TOKEN, AUTH_USER } from "@/utils/constants";

export default function useLoginMode() {
  const user = !!window.localStorage.getItem(AUTH_USER);
  const token = !!window.localStorage.getItem(AUTH_TOKEN);

  if (user && token) return "multi";
  if (!user && token) return "single";
  return null;
}
