import { useState } from "react";
import { CLEAR_COLORS_ARRAY } from "../constants";
import { Color, PaletteFormFields } from "../types";

/**
 * Custom hook to manage color palette state and operations for dynamic form fields.
 *
 * This hook provides a clean interface for managing the UI state of color input fields
 * in a color palette form. It handles the dynamic addition/removal of color fields while
 * maintaining unique identifiers and proper state management.
 *
 * **Responsibilities:**
 * - Tracks the number and structure of color fields displayed in the UI
 * - Maintains unique IDs for each color field to ensure proper React key handling
 * - Provides functions to dynamically add/remove color fields
 * - Initializes state from draft values when resuming form editing
 * - Ensures at least one color field is always present (UX requirement)
 *
 * **Not Responsible For:**
 * - Storing actual color values (handled by the form state)
 * - Form validation or submission logic
 * - UI focus management or user interactions
 *
 * @param draftValues - Optional saved form values to restore previous session state.
 *                     When provided, the hook will initialize the correct number of
 *                     color fields based on existing color entries in the draft.
 *
 * @returns An object containing:
 * - `colors`: Array of color field objects with unique IDs for rendering
 * - `addColor`: Function to append a new color field to the form
 * - `removeColor`: Function to remove a specific color field (maintains minimum of 1)
 * - `clearColors`: Function to reset to initial state with one empty color field
 *
 * @example
 * ```typescript
 * // Basic usage in a component
 * const { colors, addColor, removeColor, clearColors } = useColorPalette();
 *
 * // With draft values (form restoration)
 * const { colors, addColor, removeColor } = useColorPalette(savedDraftValues);
 *
 * // Rendering color fields
 * {colors.map((colorField) => (
 *   <Form.TextField
 *     key={colorField.id}
 *     id={`color${colorField.id}`}
 *     title={`Color ${colorField.id}`}
 *   />
 * ))}
 * ```
 *
 * @example
 * ```typescript
 * // Example colors state structure:
 * [
 *   { id: 1, color: "" },  // First color field
 *   { id: 2, color: "" },  // Second color field
 *   { id: 5, color: "" }   // Third field (IDs may not be sequential after removals)
 * ]
 * ```
 */
export function useColorPalette(draftValues?: PaletteFormFields) {
  // Initialize colors array based on draft values or default to single empty color field
  // This ensures proper form restoration when users return to edit a saved draft
  const [colors, setColors] = useState<Color[]>(() => {
    if (draftValues) {
      // Count existing color fields in draft (fields are named "color1", "color2", etc.)
      const colorKeys = Object.keys(draftValues).filter((key) => key.startsWith("color"));
      if (colorKeys.length > 0) {
        // Create color field objects with sequential IDs to match the existing draft structure
        return colorKeys.map((_, index) => ({ id: index + 1, color: "" }));
      }
    }
    // Default: single empty color field for new palettes
    return CLEAR_COLORS_ARRAY;
  });

  /**
   * Adds a new color field to the form.
   * Generates a unique ID by finding the highest existing ID and incrementing it.
   * This approach ensures no ID conflicts even after field removals.
   */
  const addColor = () => {
    const nextId = colors.length > 0 ? Math.max(...colors.map((c) => c.id)) + 1 : 1;
    setColors((prev) => [...prev, { id: nextId, color: "" }]);
  };

  /**
   * Removes a specific color field by ID.
   * Enforces the business rule that at least one color field must remain.
   *
   * @param colorId - The unique ID of the color field to remove
   */
  const removeColor = (colorId: number) => {
    if (colors.length > 1) {
      // Ensure at least one color field remains for UX purposes
      setColors((prev) => prev.filter((c) => c.id !== colorId));
    }
  };

  /**
   * Resets the color fields to initial state (single empty field).
   * Useful for "clear all" functionality or form reset operations.
   */
  const clearColors = () => {
    setColors(CLEAR_COLORS_ARRAY);
  };

  return {
    colors,
    addColor,
    removeColor,
    clearColors,
  };
}
