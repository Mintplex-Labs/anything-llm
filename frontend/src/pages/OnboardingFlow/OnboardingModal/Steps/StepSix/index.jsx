import React from "react";

// Create workspace step
export default function StepSix() {
  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const form = new FormData(e.target);
    const { workspace, error } = await Admin.newWorkspace(form.get("name"));
    if (!!workspace) window.location.reload();
    setError(error);
  };
  return (
    <div className="flex flex-col w-full md:px-8 py-12">
      <form onSubmit={handleCreate}>
        <div className="space-y-6 flex h-full w-96">
          <div className="w-full flex flex-col gap-y-4">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-white"
              >
                Workspace name
              </label>
              <input
                name="name"
                type="text"
                className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="My workspace"
                minLength={4}
                required={true}
                autoComplete="off"
              />
            </div>
            <p className="text-white text-opacity-60 text-xs md:text-sm">
              After creating this workspace only admins will be able to see it.
              You can add users after it has been created.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
