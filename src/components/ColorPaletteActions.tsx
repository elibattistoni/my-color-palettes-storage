/**
 * ColorPaletteActions Component
 *
 * Action panel providing form actions with keyboard shortcuts for color palette creation.
 * Organizes actions logically for efficient workflow management.
 */

import { Action, ActionPanel } from "@raycast/api";
import { colorWheel } from "../utils/colorWheel";
import { convertColor } from "../utils/convertColor";
import { generateColors } from "../utils/generateColors";
import { pickColor } from "../utils/pickColor";

/**
 * Props interface for the ColorPaletteActions component.
 */
interface ColorPaletteActionsProps {
  /** Form submission handler */
  handleSubmit: (values: any) => boolean | void | Promise<boolean | void>;
  /** Function to add a new color field */
  addColor: () => void;
  /** Function to remove the last color field */
  removeColor: () => void;
  /** Function to reset the entire form */
  clearForm: () => void;
  /** Current number of color fields */
  colorFieldCount: number;
  /** Effectively focused color field with ID and value (current or last focused) */
  focusedColor?: { id: number; value: string };
}

/**
 * Renders action panel with form actions and keyboard shortcuts.
 *
 * @param props - Component properties containing action handlers and state
 */
export function ColorPaletteActions({
  handleSubmit,
  addColor,
  removeColor,
  clearForm,
  colorFieldCount,
  focusedColor,
}: ColorPaletteActionsProps) {
  console.log("🧨🧨🧨🧨 focusedColor", focusedColor);
  return (
    <ActionPanel>
      {/* Primary action: Submit form to save palette */}
      <Action.SubmitForm onSubmit={handleSubmit} />

      {/* Color field management actions */}
      <Action title="Add New Color Field" onAction={addColor} shortcut={{ modifiers: ["cmd"], key: "n" }} />

      {/* Remove action only available when multiple color fields exist */}
      {colorFieldCount > 1 && (
        <Action title="Remove Last Color" onAction={removeColor} shortcut={{ modifiers: ["cmd"], key: "backspace" }} />
      )}

      {/* External tool integration */}
      <Action title="Pick Color" shortcut={{ modifiers: ["cmd", "shift"], key: "p" }} onAction={pickColor} />
      <Action title="Color Wheel" shortcut={{ modifiers: ["cmd", "shift"], key: "w" }} onAction={colorWheel} />
      <Action title="Generate Colors" shortcut={{ modifiers: ["cmd", "shift"], key: "g" }} onAction={generateColors} />
      {focusedColor && (
        <Action
          title="Convert Color"
          shortcut={{ modifiers: ["cmd", "shift"], key: "t" }}
          onAction={() => convertColor(focusedColor?.value)}
        />
      )}

      {/* Form management actions */}
      <Action title="Clear Form" onAction={clearForm} shortcut={{ modifiers: ["cmd", "shift"], key: "r" }} />
    </ActionPanel>
  );
}
