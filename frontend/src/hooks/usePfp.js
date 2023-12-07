import { useContext } from "react";
import { PfpContext } from "../PfpContext";

export default function usePfp() {
  const { pfp, setPfp } = useContext(PfpContext);
  return { pfp, setPfp };
}
