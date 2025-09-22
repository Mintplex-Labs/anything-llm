import System from "@/models/system";
import debounce from "lodash.debounce";
import { useEffect, useRef, useState } from "react";

export function useSlashCommands({ sendCommand }) {
  const [showSlashCommand, setShowSlashCommand] = useState(false);
  const [highlightedSlashCommand, setHighlightedSlashCommand] = useState(1);
  const [slashCommands, setSlashCommands] = useState([]);
  //   const [qtyOfSlashCommands, setQtyOfSlashCommands] = useState(0);
  // Ref to the textarea element, this is needed to apply focus to the textarea when slash commands are triggered by clicking the slash command button
  const textareaRef = useRef(null);

  // Check for slash command to show slash commands
  function checkForSlash(e) {
    const input = e.target.value;
    if (input === "/") {
      setShowSlashCommand(true);
      setHighlightedSlashCommand(0); // Start with reset command highlighted
    }
    if (showSlashCommand) setShowSlashCommand(false);
    return;
  }
  const watchForSlash = debounce(checkForSlash, 300);
  const fetchSlashCommands = async () => {
    const presets = await System.getSlashCommandPresets();
    setSlashCommands(presets);
    // setQtyOfSlashCommands(presets.length + 1);
  };

  useEffect(() => {
    fetchSlashCommands();
  }, []);

  // Focus the textarea when slash commands are shown, this is needed to enable keyboard navigation
  useEffect(() => {
    if (showSlashCommand) {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [showSlashCommand]);

  // Handle key down events for slash command navigation and selection
  function handleKeyDown(e) {
    // Only handle arrow keys when slash commands are showing
    if (!showSlashCommand) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedSlashCommand((prev) => {
        if (prev <= 0) {
          return slashCommands.length;
        }
        return prev - 1;
      });
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedSlashCommand((prev) => {
        if (prev >= slashCommands.length) {
          return 0;
        }
        return prev + 1;
      });
    }
    if (e.key === "Enter" && showSlashCommand) {
      e.preventDefault();

      if (highlightedSlashCommand === 0) {
        setShowSlashCommand(false);
        sendCommand({ text: "/reset", autoSubmit: true });
        // Reset command is selected
        return;
      }

      // Check if it's a preset selection (index 1 and above)
      const presetIndex = highlightedSlashCommand - 1;
      if (presetIndex >= 0 && presetIndex < slashCommands.length) {
        const preset = slashCommands[presetIndex];
        setShowSlashCommand(false);
        sendCommand({ text: `${preset.command} ` });
        textareaRef?.current?.focus();
      }
    }

    if (e.key === "Escape" && showSlashCommand) {
      e.preventDefault();
      setShowSlashCommand(false);
    }
  }
  return {
    slashCommands,
    setSlashCommands,
    showSlashCommand,
    setShowSlashCommand,
    highlightedSlashCommand,
    setHighlightedSlashCommand,
    // qtyOfSlashCommands,
    // setQtyOfSlashCommands,
    watchForSlash,
    handleKeyDown,
    textareaRef,
  };
}
