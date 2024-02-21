export default function WorkspaceName({ workspace, setHasChanges }) {
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          Workspace Name
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          This will only change the display name of your workspace.
        </p>
      </div>
      <input
        name="name"
        type="text"
        minLength={2}
        maxLength={80}
        defaultValue={workspace?.name}
        className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="My Workspace"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}
