import System from "@/models/system";
import showToast from "@/utils/toast";
import React, { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import paths from "@/utils/paths";
import { useNavigate } from "react-router-dom";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";

const TITLE = "User Setup";
const DESCRIPTION = "Configure your user settings.";

export default function UserSetup({ setHeader, setForwardBtn, setBackBtn }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [singleUserPasswordValid, setSingleUserPasswordValid] = useState(false);
  const [multiUserLoginValid, setMultiUserLoginValid] = useState(false);
  const [enablePassword, setEnablePassword] = useState(false);
  const myTeamSubmitRef = useRef(null);
  const justMeSubmitRef = useRef(null);
  const navigate = useNavigate();

  function handleForward() {
    if (selectedOption === "just_me" && enablePassword) {
      justMeSubmitRef.current?.click();
    } else if (selectedOption === "just_me" && !enablePassword) {
      navigate(paths.onboarding.dataHandling());
    } else if (selectedOption === "my_team") {
      myTeamSubmitRef.current?.click();
    }
  }

  function handleBack() {
    navigate(paths.onboarding.llmPreference());
  }

  useEffect(() => {
    let isDisabled = true;
    if (selectedOption === "just_me") {
      isDisabled = !singleUserPasswordValid;
    } else if (selectedOption === "my_team") {
      isDisabled = !multiUserLoginValid;
    }

    setForwardBtn({
      showing: true,
      disabled: isDisabled,
      onClick: handleForward,
    });
  }, [selectedOption, singleUserPasswordValid, multiUserLoginValid]);

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  return (
    <div className="w-full flex items-center justify-center flex-col gap-y-6">
      <div className="flex flex-col border rounded-lg border-white/20 p-8 items-center gap-y-4 w-full max-w-[600px]">
        <div className=" text-white text-sm font-semibold md:-ml-44">
          How many people will be using your instance?
        </div>
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          <button
            onClick={() => setSelectedOption("just_me")}
            className={`${
              selectedOption === "just_me"
                ? "text-sky-400 border-sky-400/70"
                : "text-white border-white/40"
            } min-w-[230px] h-11 p-4 rounded-[10px] border-2  justify-center items-center gap-[100px] inline-flex hover:border-sky-400/70 hover:text-sky-400 transition-all duration-300`}
          >
            <div className="text-center text-sm font-bold">Just me</div>
          </button>
          <button
            onClick={() => setSelectedOption("my_team")}
            className={`${
              selectedOption === "my_team"
                ? "text-sky-400 border-sky-400/70"
                : "text-white border-white/40"
            } min-w-[230px] h-11 p-4 rounded-[10px] border-2  justify-center items-center gap-[100px] inline-flex hover:border-sky-400/70 hover:text-sky-400 transition-all duration-300`}
          >
            <div className="text-center text-sm font-bold">My team</div>
          </button>
        </div>
      </div>
      {selectedOption === "just_me" && (
        <JustMe
          setSingleUserPasswordValid={setSingleUserPasswordValid}
          enablePassword={enablePassword}
          setEnablePassword={setEnablePassword}
          justMeSubmitRef={justMeSubmitRef}
          navigate={navigate}
        />
      )}
      {selectedOption === "my_team" && (
        <MyTeam
          setMultiUserLoginValid={setMultiUserLoginValid}
          myTeamSubmitRef={myTeamSubmitRef}
          navigate={navigate}
        />
      )}
    </div>
  );
}

const JustMe = ({
  setSingleUserPasswordValid,
  enablePassword,
  setEnablePassword,
  justMeSubmitRef,
  navigate,
}) => {
  const [itemSelected, setItemSelected] = useState(false);
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const { error } = await System.updateSystemPassword({
      usePassword: true,
      newPassword: formData.get("password"),
    });

    if (error) {
      showToast(`Failed to set password: ${error}`, "error");
      return;
    }

    // Auto-request token with password that was just set so they
    // are not redirected to login after completion.
    const { token } = await System.requestToken({
      password: formData.get("password"),
    });
    window.localStorage.removeItem(AUTH_USER);
    window.localStorage.removeItem(AUTH_TIMESTAMP);
    window.localStorage.setItem(AUTH_TOKEN, token);

    navigate(paths.onboarding.dataHandling());
  };

  const setNewPassword = (e) => setPassword(e.target.value);
  const handlePasswordChange = debounce(setNewPassword, 500);

  function handleYes() {
    setItemSelected(true);
    setEnablePassword(true);
  }

  function handleNo() {
    setItemSelected(true);
    setEnablePassword(false);
  }

  useEffect(() => {
    if (enablePassword && itemSelected && password.length >= 8) {
      setSingleUserPasswordValid(true);
    } else if (!enablePassword && itemSelected) {
      setSingleUserPasswordValid(true);
    } else {
      setSingleUserPasswordValid(false);
    }
  });
  return (
    <div className="w-full flex items-center justify-center flex-col gap-y-6">
      <div className="flex flex-col border rounded-lg border-white/20 p-8 items-center gap-y-4 w-full max-w-[600px]">
        <div className=" text-white text-sm font-semibold md:-ml-56">
          Would you like to set up a password?
        </div>
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          <button
            onClick={handleYes}
            className={`${
              enablePassword && itemSelected
                ? "text-sky-400 border-sky-400/70"
                : "text-white border-white/40"
            } min-w-[230px] h-11 p-4 rounded-[10px] border-2  justify-center items-center gap-[100px] inline-flex hover:border-sky-400/70 hover:text-sky-400 transition-all duration-300`}
          >
            <div className="text-center text-sm font-bold">Yes</div>
          </button>
          <button
            onClick={handleNo}
            className={`${
              !enablePassword && itemSelected
                ? "text-sky-400 border-sky-400/70"
                : "text-white border-white/40"
            } min-w-[230px] h-11 p-4 rounded-[10px] border-2  justify-center items-center gap-[100px] inline-flex hover:border-sky-400/70 hover:text-sky-400 transition-all duration-300`}
          >
            <div className="text-center text-sm font-bold">No</div>
          </button>
        </div>
        {enablePassword && (
          <form className="w-full mt-4" onSubmit={handleSubmit}>
            <label
              htmlFor="name"
              className="block mb-3 text-sm font-medium text-white"
            >
              Instance Password
            </label>
            <input
              name="password"
              type="password"
              className="bg-zinc-900 text-white text-sm rounded-lg block w-full p-2.5"
              placeholder="Your admin password"
              minLength={6}
              required={true}
              autoComplete="off"
              onChange={handlePasswordChange}
            />
            <div className="mt-4 text-white text-opacity-80 text-xs font-base -mb-2">
              Passwords must be at least 8 characters.
              <br />
              <i>
                It's important to save this password because there is no
                recovery method.
              </i>{" "}
            </div>
            <button
              type="submit"
              ref={justMeSubmitRef}
              hidden
              aria-hidden="true"
            ></button>
          </form>
        )}
      </div>
    </div>
  );
};

const MyTeam = ({ setMultiUserLoginValid, myTeamSubmitRef, navigate }) => {
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
      showToast(`Error: ${error}`, "error");
      return;
    }

    navigate(paths.onboarding.dataHandling());
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

  useEffect(() => {
    if (username.length >= 6 && password.length >= 8) {
      setMultiUserLoginValid(true);
    } else {
      setMultiUserLoginValid(false);
    }
  }, [username, password]);
  return (
    <div className="w-full flex items-center justify-center border max-w-[600px] rounded-lg border-white/20">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-full md:px-8 px-2 py-4">
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
            By default, you will be the only admin. Once onboarding is completed
            you can create and invite others to be users or admins. Do not lose
            your password as only admins can reset passwords.
          </div>
        </div>
        <button
          type="submit"
          ref={myTeamSubmitRef}
          hidden
          aria-hidden="true"
        ></button>
      </form>
    </div>
  );
};
