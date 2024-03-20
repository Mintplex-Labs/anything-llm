import TextAreaBlock from "@/components/Generic/Blocks/TextAreaBlock";
import EnableSystemPrompt from "./EnableSystemPrompt";
import CheckBoxBlock from "@/components/Generic/Blocks/CheckBoxBlock";

export default function InputsFeature({ workspace, config }) {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <EnableSystemPrompt workspace={workspace} config={config} />
      <TextAreaBlock workspace={workspace} />
      <CheckBoxBlock
        workspace={workspace}
        label="override workspace prompt"
        inline
        name="systemPrompt"
      />
    </div>
  );
}
