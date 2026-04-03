import { useState } from "react";
import { CircleNotch } from "@phosphor-icons/react";
import ModelRouterAPI from "@/models/modelRouter";
import showToast from "@/utils/toast";
import LLMProviderModelPicker from "../LLMProviderModelPicker";

const PROPERTIES = [
  { value: "promptContent", label: "Prompt Content" },
  { value: "conversationTokenCount", label: "Conversation Token Count" },
];

const STRING_COMPARATORS = [
  { value: "contains", label: "contains" },
  { value: "eq", label: "equals" },
  { value: "neq", label: "not equals" },
];

const NUMERIC_COMPARATORS = [
  { value: "gt", label: "greater than" },
  { value: "gte", label: "greater than or equal" },
  { value: "lt", label: "less than" },
  { value: "lte", label: "less than or equal" },
  { value: "eq", label: "equals" },
  { value: "neq", label: "not equals" },
];

const NUMERIC_PROPERTIES = ["conversationTokenCount"];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export default function RuleForm({
  routerId,
  existingRule = null,
  nextPriority,
  onSaved,
  onCancel,
}) {
  const isEditing = !!existingRule;
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState(existingRule?.property || "");

  const comparators = NUMERIC_PROPERTIES.includes(property)
    ? NUMERIC_COMPARATORS
    : STRING_COMPARATORS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      title: slugify(formData.get("title") || ""),
      type: "calculated",
      property: formData.get("property"),
      comparator: formData.get("comparator"),
      value: formData.get("value"),
      route_provider: formData.get("route_provider"),
      route_model: formData.get("route_model"),
      priority: isEditing ? existingRule.priority : Number(nextPriority),
    };

    if (!data.title) {
      showToast("Title is required", "error");
      setLoading(false);
      return;
    }

    let result;
    if (isEditing) {
      result = await ModelRouterAPI.updateRule(routerId, existingRule.id, data);
    } else {
      result = await ModelRouterAPI.createRule(routerId, data);
    }

    setLoading(false);
    if (result.rule) {
      showToast(isEditing ? "Rule updated" : "Rule created", "success", {
        clear: true,
      });
      onSaved();
    } else {
      showToast(result.error || "Failed to save rule", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <p className="text-sm font-semibold text-white light:text-slate-900">
        {isEditing ? "Edit Rule" : "New Rule"}
      </p>

      <div className="flex flex-col gap-y-1.5">
        <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={existingRule?.title || ""}
          placeholder="e.g. route_code_to_claude"
          className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 text-sm rounded-lg outline-none block w-full p-2.5 font-mono"
          required
        />
        <p className="text-[10px] text-zinc-400 light:text-slate-500">
          Lowercase with underscores only. Auto-formatted on save.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-y-1.5">
          <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
            Property
          </label>
          <select
            name="property"
            defaultValue={existingRule?.property || ""}
            onChange={(e) => setProperty(e.target.value)}
            className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 text-sm rounded-lg outline-none block w-full p-2.5"
            required
          >
            <option value="">Select</option>
            {PROPERTIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-y-1.5">
          <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
            Comparator
          </label>
          <select
            name="comparator"
            defaultValue={existingRule?.comparator || ""}
            className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 text-sm rounded-lg outline-none block w-full p-2.5"
            required
          >
            <option value="">Select</option>
            {comparators.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-y-1.5">
          <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
            Value
          </label>
          <input
            type="text"
            name="value"
            defaultValue={existingRule?.value || ""}
            placeholder={
              NUMERIC_PROPERTIES.includes(property) ? "e.g. 4000" : "e.g. code"
            }
            className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 text-sm rounded-lg outline-none block w-full p-2.5"
            required
          />
        </div>
      </div>

      <LLMProviderModelPicker
        providerFieldName="route_provider"
        modelFieldName="route_model"
        label="Route to Provider & Model"
        description="When this rule matches, use this provider/model"
        defaultProvider={existingRule?.route_provider || ""}
        defaultModel={existingRule?.route_model || ""}
      />

      <div className="flex justify-end gap-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-zinc-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 px-4 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-x-1.5 text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-lg h-9 px-5 hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <CircleNotch className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            "Update Rule"
          ) : (
            "Create Rule"
          )}
        </button>
      </div>
    </form>
  );
}
