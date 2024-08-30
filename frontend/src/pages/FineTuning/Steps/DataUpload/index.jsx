import { useEffect, useState } from "react";
import FineTuning from "@/models/experimental/fineTuning";
import Workspace from "@/models/workspace";
import {
  CheckCircle,
  Warning,
  X,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import FineTuningSteps from "..";
import CTAButton from "@/components/lib/CTAButton";

export default function DataUpload({ setSettings, setStep }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [dataFilters, setDataFilters] = useState({
    workspaces: [],
    feedback: null,
  });

  useEffect(() => {
    Workspace.all()
      .then((workspaces) => {
        const workspaceOpts = workspaces.map((ws) => {
          return { slug: ws.slug, name: ws.name };
        });
        setWorkspaces(workspaceOpts);
        setDataFilters((prev) => {
          return { ...prev, workspaces: workspaceOpts };
        });
      })
      .catch(() => null);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSettings((prev) => {
      return {
        ...prev,
        trainingData: {
          slugs: dataFilters.workspaces.map((ws) => ws.slug),
          feedback: dataFilters.feedback,
        },
      };
    });
    setStep(FineTuningSteps["data-selection"].next());
  }

  return (
    <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
      <div className="bg-[#303237] text-white rounded-xl flex-1 p-6">
        <div className="w-full flex flex-col gap-y-3 max-w-[700px]">
          <h2 className="text-base text-white font-semibold">
            Select your training dataset
          </h2>
          <p className="text-white/80 text-sm">
            This is the data your model will be trained and tuned on. This is a
            critical step and you should always train on the exact information
            you want the model to inherit. By default, AnythingLLM will use all
            chats, but you can filter chats by workspace and even limit training
            to chats which users have left a positive feedback indication on
            (thumbs up).
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-y-6 mt-4">
            <div className="flex flex-col">
              <label className="text-white text-sm font-semibold block mb-3">
                Only use positive responses
              </label>
              <p className="text-xs font-normal text-white/80 mb-2">
                Enabling this toggle will filter your dataset to only use
                "positive" responses that were marked during chatting.
              </p>
              <label className="relative inline-flex cursor-pointer items-center w-fit">
                <input
                  type="checkbox"
                  onClick={() =>
                    setDataFilters((prev) => {
                      return { ...prev, feedback: !prev.feedback };
                    })
                  }
                  checked={dataFilters.feedback}
                  className="peer sr-only pointer-events-none"
                />
                <div className="pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-none"></div>
              </label>
            </div>

            <div className="flex flex-col">
              <label className="text-white text-sm font-semibold block mb-3">
                Selected Workspaces
              </label>
              <p className="text-xs font-normal text-white/80 mb-2">
                Your training data will be limited to these workspaces.
              </p>
              <WorkspaceSelector
                workspaces={workspaces}
                selectedWorkspaces={dataFilters.workspaces}
                setDataFilters={setDataFilters}
              />
            </div>

            <DatasetSummary
              workspaces={dataFilters.workspaces}
              feedback={dataFilters.feedback}
            />

            <CTAButton
              type="submit"
              className="text-dark-text w-full mt-[18px] h-[34px] hover:bg-accent"
            >
              Proceed to Confirmation &rarr;
            </CTAButton>
          </form>
        </div>
      </div>
    </div>
  );
}

function WorkspaceSelector({
  workspaces = [],
  selectedWorkspaces = [],
  setDataFilters,
}) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const availableWorkspaces = workspaces.filter(
    (ws) =>
      !selectedWorkspaces.find((selectedWs) => selectedWs.slug === ws.slug)
  );

  function handleAddWorkspace(workspace) {
    setDataFilters((prev) => {
      return {
        ...prev,
        workspaces: [...prev.workspaces, workspace],
      };
    });
    setQuery("");
    setShowSuggestions(false);
  }

  function handleRemoveWorkspace(workspace) {
    setDataFilters((prev) => {
      const filtered = prev.workspaces.filter(
        (ws) => ws.slug !== workspace.slug
      );
      return {
        ...prev,
        workspaces: filtered,
      };
    });
    setQuery("");
    setShowSuggestions(false);
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="min-w-[150px] max-w-[300px] h-[32px] p-[10px] rounded-lg flex items-center bg-dark-highlight mt-1">
        <MagnifyingGlass size={16} className="text-white" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() =>
            setTimeout(() => {
              setShowSuggestions(false);
            }, 500)
          }
          placeholder="Enter a workspace name"
          className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-white text-xs placeholder:`text-white/50`"
        />
      </div>
      <div className="flex flex-col items-center -ml-2">
        <div className="w-full h-fit">
          <div className="w-full relative z-1">
            <div className="p-2 flex  rounded-lg">
              <div className="flex flex-wrap gap-2 w-full">
                {selectedWorkspaces.map((workspace) => {
                  return (
                    <div
                      key={workspace.slug}
                      className="flex items-center justify-between rounded-full h-[20px] bg-white/10 px-2 py-1 text-xs font-medium text-white shadow-sm"
                    >
                      <span className="truncate mr-1">{workspace.name}</span>
                      <button
                        onClick={() => handleRemoveWorkspace(workspace)}
                        type="button"
                        className="hover:text-red-500 flex-shrink-0"
                      >
                        <X size={10} weight="bold" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {showSuggestions && (
            <div className="w-full flex relative">
              <div className="w-full absolute top-0 z-20">
                <WorkspaceSuggestions
                  availableWorkspaces={availableWorkspaces}
                  addWorkspace={handleAddWorkspace}
                  query={query}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkspaceSuggestions({
  availableWorkspaces = [],
  addWorkspace,
  query = "",
}) {
  if (availableWorkspaces.length === 0) {
    return (
      <div className="w-full mt-[2px] bg-zinc-900 top-[45px] h-40 rounded-lg p-2 text-sm">
        <p className="text-center text-white/40">
          no workspaces available to select.
        </p>
      </div>
    );
  }

  const filteredWorkspace = !!query
    ? availableWorkspaces.filter((ws) => {
        return (
          ws.slug.toLowerCase().includes(query.toLowerCase()) ||
          ws.name.toLowerCase().includes(query.toLowerCase())
        );
      })
    : availableWorkspaces;

  return (
    <div className="w-full mt-[2px] bg-zinc-900 top-[45px] h-40 rounded-lg p-2 text-sm flex flex-col gap-y-1 justify-start overflow-y-scroll">
      {filteredWorkspace.map((workspace) => {
        return (
          <button
            key={workspace.slug}
            onClick={() => addWorkspace(workspace)}
            type="button"
            className="text-left text-white hover:bg-white/10 rounded-lg p-1"
          >
            {workspace.name}
          </button>
        );
      })}
    </div>
  );
}

function DatasetSummary({ workspaces = [], feedback = null }) {
  const [stats, setStats] = useState({ count: null, recommendedMin: 50 });
  useEffect(() => {
    function getStats() {
      const slugs = workspaces?.map((ws) => ws.slug);
      if (!slugs || slugs.length === 0) return;

      FineTuning.datasetStat({ slugs, feedback })
        .then((stats) => setStats(stats))
        .catch((e) => null);
    }
    getStats();
  }, [workspaces, feedback]);

  return (
    <div className="bg-zinc-900 text-white/80 p-4 rounded-lg text-sm">
      <p>Training dataset size: {stats.count ?? "Unknown"}</p>
      {stats.count < stats.recommendedMin ? (
        <div className="flex items-center gap-x-1 text-red-500 text-sm p-2 rounded-lg bg-red-500/20 w-fit my-2">
          <Warning size={14} />
          <p>
            Your dataset is below the recommended minimum of{" "}
            {stats.recommendedMin}! You may see no impact from a fine-tune.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-x-1 text-green-500 text-sm p-2 rounded-lg bg-green-500/20 w-fit my-2">
          <CheckCircle size={14} />
          <p>
            Your dataset is large enough that you should see good results from a
            fine-tune.
          </p>
        </div>
      )}
    </div>
  );
}
