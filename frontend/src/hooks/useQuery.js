export default function useQuery() {
  return new URLSearchParams(window.location.search);
}
