import { useContext } from "react";
import { AuthContext } from "../AuthContext";

// interface IStore {
//   store: {
//     user: {
//       id: string;
//       username: string | null;
//       role: string;
//     };
//   };
// }

export default function useUser() {
  const context = useContext(AuthContext);

  return { ...context.store };
}
