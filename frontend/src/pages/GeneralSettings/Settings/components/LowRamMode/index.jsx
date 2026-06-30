import React, { useState } from "react";
import Appearance from "@/models/appearance";
import Toggle from "@/components/lib/Toggle";

export default function LowRamMode() {
  const [saving, setSaving] = useState(false);
  const [lowRamMode, setLowRamMode] = useState(Appearance.lowRamModeEnabled());

  const handleChange = async (checked) => {
    setLowRamMode(checked);
    setSaving(true);
    try {
      Appearance.setLowRamMode(checked);
    } catch (error) {
      console.error("Failed to update low RAM mode:", error);
      setLowRamMode(!checked);
    }
    setSaving(false);
  };

  return (
    <div className="my-4">
      <Toggle
        size="md"
        variant="horizontal"
        enabled={lowRamMode}
        onChange={handleChange}
        disabled={saving}
        label="Low RAM mode"
        description="Reduces UI animation, transition and rendering overhead for 4GB/8GB RAM computers and older integrated-GPU systems."
      />
    </div>
  );
}
