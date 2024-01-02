import useLogo from "@/hooks/useLogo";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { Plus } from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";
import AnythingLLM from "@/media/logo/anything-llm.png";
import debounce from "lodash.debounce";
const TITLE = "User Setup";
const DESCRIPTION = "Configure your user settings.";

export default function UserSetup({ setHeader, setForwardBtn }) {
  const [selectedOption, setSelectedOption] = useState("");

  function handleForward() {
    console.log("Go forward");
  }

  function handleClick(option) {
    setSelectedOption(option);
  }

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
  }, []);

  return (
    <div className="w-full flex items-center justify-center flex-col gap-y-6">
      <div className="flex flex-col border rounded-lg border-white/20 p-8 items-center gap-y-4 w-full max-w-[600px]">
        <div className=" text-white text-sm font-semibold -ml-44">
          How many people will be using your instance?
        </div>
        <div className="flex flex-row gap-x-6 w-full justify-center">
          <button
            onClick={() => handleClick("just_me")}
            className={`min-w-[230px] h-11 p-4 rounded-[10px] border-2 border-white/40 justify-center items-center gap-[100px] inline-flex text-white hover:border-sky-400/40 hover:text-sky-400 transition-all duration-300 ${
              selectedOption === "just_me"
                ? "text-sky-400 border-sky-400 border-opacity-40"
                : ""
            }`}
          >
            <div className="text-center text-sm font-bold">Just me</div>
          </button>
          <button
            onClick={() => handleClick("my_team")}
            className={`min-w-[230px] h-11 p-4 rounded-[10px] border-2 border-white/40 justify-center items-center gap-[100px] inline-flex text-white hover:border-sky-400/40 hover:text-sky-400 transition-all duration-300 ${
              selectedOption === "my_team"
                ? "text-sky-400 border-sky-400 border-opacity-40"
                : ""
            }`}
          >
            <div className="text-center text-sm font-bold">My team</div>
          </button>
        </div>
      </div>
      {selectedOption === "just_me" && <JustMe />}
      {selectedOption === "my_team" && <MyTeam />}
    </div>
  );
}

const JustMe = () => {
  const [enablePassword, setEnablePassword] = useState(false);
  const [itemSelected, setItemSelected] = useState(false);

  function handleYes() {
    setItemSelected(true);
    setEnablePassword(true);
  }

  function handleNo() {
    setItemSelected(true);
    setEnablePassword(false);
  }
  return (
    <div className="w-full flex items-center justify-center flex-col gap-y-6">
      <div className="flex flex-col border rounded-lg border-white/20 p-8 items-center gap-y-4 w-full max-w-[600px]">
        <div className=" text-white text-sm font-semibold -ml-56">
          Would you like to set up a password?
        </div>
        <div className="flex flex-row gap-x-6 w-full justify-center">
          <button
            onClick={handleYes}
            className={`min-w-[230px] h-11 p-4 rounded-[10px] border-2 border-white/40 justify-center items-center gap-[100px] inline-flex text-white hover:border-sky-400/40 hover:text-sky-400 transition-all duration-300 ${
              enablePassword && itemSelected
                ? "text-sky-400 border-sky-400 border-opacity-40"
                : ""
            } `}
          >
            <div className="text-center text-sm font-bold">Yes</div>
          </button>
          <button
            onClick={handleNo}
            className={`min-w-[230px] h-11 p-4 rounded-[10px] border-2 border-white/40 justify-center items-center gap-[100px] inline-flex text-white hover:border-sky-400/40 hover:text-sky-400 transition-all duration-300 ${
              !enablePassword && itemSelected
                ? "text-sky-400 border-sky-400 border-opacity-40"
                : ""
            }`}
          >
            <div className="text-center text-sm font-bold">No</div>
          </button>
        </div>
        {enablePassword && (
          <div className="w-full mt-4">
            <label
              htmlFor="name"
              className="block mb-3 text-sm font-medium text-white"
            >
              Instance Password
            </label>
            <input
              name="username"
              type="password"
              className="bg-zinc-900 text-white text-sm rounded-lg block w-full p-2.5"
              placeholder="Your admin password"
              minLength={6}
              required={true}
              autoComplete="off"
            />
            <div className="mt-4 text-white text-opacity-80 text-xs font-base -mb-2">
              It's important to save this password because there is no recovery
              method.{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MyTeam = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };
    const { success, error } = await System.setupMultiUser(data);
    if (!success) {
      alert(error);
      return;
    }

    // Auto-request token with credentials that was just set so they
    // are not redirected to login after completion.
    const { user, token } = await System.requestToken(data);
    window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
    window.localStorage.setItem(AUTH_TOKEN, token);
    window.localStorage.removeItem(AUTH_TIMESTAMP);
  };

  const setNewUsername = (e) => setUsername(e.target.value);
  const setNewPassword = (e) => setPassword(e.target.value);
  const handleUsernameChange = debounce(setNewUsername, 500);
  const handlePasswordChange = debounce(setNewPassword, 500);
  return (
    <div className="w-full flex items-center justify-center border max-w-[600px] rounded-lg border-white/20">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-full md:px-8 py-4">
          <div className="space-y-6 flex h-full w-full">
            <div className="w-full flex flex-col gap-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-3 text-sm font-medium text-white"
                >
                  Admin account username
                </label>
                <input
                  name="username"
                  type="text"
                  className="bg-zinc-900 text-white text-sm rounded-lg block w-full p-2.5"
                  placeholder="Your admin username"
                  minLength={6}
                  required={true}
                  autoComplete="off"
                  onChange={handleUsernameChange}
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="name"
                  className="block mb-3 text-sm font-medium text-white"
                >
                  Admin account password
                </label>
                <input
                  name="password"
                  type="password"
                  className="bg-zinc-900 text-white text-sm rounded-lg block w-full p-2.5"
                  placeholder="Your admin password"
                  minLength={8}
                  required={true}
                  autoComplete="off"
                  onChange={handlePasswordChange}
                />
              </div>
              <p className="w-96 text-white text-opacity-80 text-xs font-base">
                Username must be at least 6 characters long. Password must be at
                least 8 characters long.
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between items-center px-6 py-4 space-x-6 border-t rounded-b border-gray-500/50">
          <div className=" text-white text-opacity-80 text-xs font-base">
            By default, you will be the only admin. As an admin you will need to
            create accounts for all new users or admins. Do not lose your
            password as only admins can reset passwords.
          </div>
        </div>
      </form>
    </div>
  );
};
