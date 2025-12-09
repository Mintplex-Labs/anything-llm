import { useEffect, useRef } from "react";

/**
 * Handles keyboard navigation for the slash commands menu is presented in the UI.
 * @param {boolean} showing - Whether the slash commands menu is showing
 * @returns {void}
 */
export function useSlashCommandKeyboardNavigation({ showing }) {
  const focusedCommandRef = useRef(null);
  const availableCommands = useRef([]);

  useEffect(() => {
    const commands = document.querySelectorAll("[data-slash-command]");
    availableCommands.current = Array.from(commands).map(
      (cmd) => cmd.dataset.slashCommand
    );
  }, [showing]);

  useEffect(() => {
    if (!showing) return;
    document.addEventListener("keydown", handleKeyboardNavigation);
    return () =>
      document.removeEventListener("keydown", handleKeyboardNavigation);
  }, [showing]);

  useEffect(() => {
    // Reset the focused command when the slash commands menu is closed or opened
    focusedCommandRef.current = null;
  }, [showing]);

  function handleKeyboardNavigation(event) {
    event.preventDefault();
    if (!availableCommands.current.length) return;
    let currentIndex = availableCommands.current.indexOf(
      focusedCommandRef.current
    );

    // If the enter key is pressed, click the focused command if it exists
    // This will also trigger the onClick event of the focused command
    // to cleanup everything on hide
    if (event.key === "Enter" && !!focusedCommandRef.current) {
      document
        .querySelector(`[data-slash-command="${focusedCommandRef.current}"]`)
        ?.click();
      return;
    }

    // If the current index is -1, set it to the last command, otherwise inc/dec by 1
    if (currentIndex === -1)
      currentIndex = availableCommands.current.length - 1;
    else currentIndex += event.key === "ArrowUp" ? -1 : 1;

    // Wrap around the array both ways if index is out of bounds
    if (currentIndex < 0) currentIndex = availableCommands.current.length - 1;
    else if (currentIndex >= availableCommands.current.length) currentIndex = 0;

    focusedCommandRef.current = availableCommands.current[currentIndex];
    document
      .querySelector(`[data-slash-command="${focusedCommandRef.current}"]`)
      ?.focus();
  }
}
