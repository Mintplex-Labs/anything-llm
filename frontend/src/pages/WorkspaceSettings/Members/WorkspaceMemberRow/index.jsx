import { titleCase } from "text-case";

export default function WorkspaceMemberRow({ user }) {
  return (
    <>
      <tr className="bg-transparent text-white text-opacity-80 text-sm font-medium">
        <th scope="row" className="px-6 py-4 whitespace-nowrap">
          {user.username}
        </th>
        <td className="px-6 py-4">{titleCase(user.role)}</td>
        <td className="px-6 py-4">{user.lastUpdatedAt}</td>
      </tr>
    </>
  );
}
