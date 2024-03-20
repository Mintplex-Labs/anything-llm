import TextAreaBlock from "@/components/Generic/Blocks/TextAreaBlock";
import EnableSystemPrompt from "./EnableSystemPrompt";
import { C } from "../../../../../dist/assets/index-cf7f0eac";
import CheckBoxBlock from "@/components/Generic/Blocks/CheckBoxBlock";

export default function InputsFeature({ workspace, config }) {
  console.log("workspace: ", workspace);
  console.log("config: ", config);
  return (
    <div className="flex flex-col gap-4 mt-4">
      <EnableSystemPrompt workspace={workspace} config={config} />
      <TextAreaBlock workspace={workspace} />
      <CheckBoxBlock  workspace={workspace}  label="override workspace prompt" inline name="systemPrompt"/>
    </div>
  );
}
