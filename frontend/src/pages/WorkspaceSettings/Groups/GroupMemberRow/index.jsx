export default function WorkspaceMemberRow({ group }) {
  return (
    <>
      <tr className="bg-transparent text-theme-text-primary text-sm font-medium">
        <th scope="row" className="px-6 py-4 whitespace-nowrap">
          {group?.groupname || "-"}
        </th>
        <td className="px-6 py-4">{group?.createdAt || "-"}</td>
      </tr>
    </>
  );
}
