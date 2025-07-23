/**
 * Color Palette Actions Component
 *
 * A comprehensive action panel component that provides all the interactive actions
 * available within the color palette creation form. This component organizes actions
 * logically with appropriate keyboard shortcuts for efficient workflow management.
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
  /** Form submission handler from useForm hook */
  handleSubmit: (values: any) => boolean | void | Promise<boolean | void>;
  /** Function to add a new color field to the form */
  addColor: () => void;
  /** Function to remove the last color field from the form */
  removeColor: () => void;
  /** Function to reset the entire form to initial state */
  clearForm: () => void;
  /** Current number of color fields in the form */
  colorFieldCount: number;
  /** Currently focused/selected color with both ID and value for external operations */
  currentColor?: { id: number; value: string };
}

/**
 * Renders a comprehensive action panel with all available form actions and shortcuts.
 *
 * This component provides a well-organized set of actions that cover the complete
 * workflow of creating and managing color palettes. Actions are grouped logically
 * and include keyboard shortcuts for power users.
 *
 * **Action Categories:**
 * 1. **Primary Actions**: Submit form (save palette)
 * 2. **Color Management**: Add/remove color fields, external color picker
 * 3. **Form Management**: Clear/reset form
 *
 * **Keyboard Shortcuts:**
 * - `Enter`: Submit form and save palette
 * - `Cmd+N`: Add new color field
 * - `Cmd+Backspace`: Remove last color field (when multiple exist)
 * - `Cmd+Shift+P`: Open external color picker
 * - `Cmd+Shift+R`: Clear entire form
 *
 * **Smart Behavior:**
 * - Remove action only appears when multiple color fields exist
 * - Ensures at least one color field remains (UX requirement)
 * - Contextual action availability based on form state
 *
 * @param props - Component properties containing action handlers and state
 * @param props.handleSubmit - Form submission handler
 * @param props.addColor - Add color field function
 * @param props.removeColor - Remove color field function
 * @param props.clearForm - Form reset function
 * @param props.colors - Current color field configuration
 * @param props.currentColor - Currently focused/selected color with ID and value for external operations
 *
 * @example
 * ```tsx
 * <Form
 *   actions={
 *     <ColorPaletteActions
 *       handleSubmit={handleSubmit}
 *       addColor={addColor}
 *       removeColor={removeColor}
 *       clearForm={clearForm}
 *       colors={colors}
 *     />
 *   }
 * >
 *   // Form content
 * </Form>
 * ```
 */
export function ColorPaletteActions({
  handleSubmit,
  addColor,
  removeColor,
  clearForm,
  colorFieldCount,
  currentColor,
}: ColorPaletteActionsProps) {
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
      {currentColor && (
        <Action
          title="Convert Color"
          shortcut={{ modifiers: ["cmd", "shift"], key: "t" }}
          onAction={() => convertColor(currentColor?.value)}
        />
      )}

      {/* Form management actions */}
      <Action title="Clear Form" onAction={clearForm} shortcut={{ modifiers: ["cmd", "shift"], key: "r" }} />
    </ActionPanel>
  );
}
