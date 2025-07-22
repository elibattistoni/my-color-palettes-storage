/**
 * Custom hook for intelligent form field focus management.
 *
 * This hook provides smart focus behavior when restoring forms from draft values,
 * improving user experience by positioning the cursor at the most logical location
 * for continued editing. It analyzes the form state and determines the optimal
 * field to focus based on completion status.
 */

import { PaletteFormFields } from "../types";

/**
 * Manages form field focus behavior for optimal user experience during draft restoration.
 *
 * When users return to edit a saved draft, this hook determines which form field
 * should receive initial focus based on the current completion state. It implements
 * intelligent logic to position the cursor where the user is most likely to continue
 * their work.
 *
 * **Focus Logic:**
 * 1. New forms (no draft): Use default Raycast focus behavior
 * 2. Draft with color values: Focus on the first empty color field after filled ones
 * 3. All color fields filled: Focus on the last color field for easy modification
 * 4. No color values in draft: Focus on the first color field
 *
 * **Benefits:**
 * - Reduces cognitive load by predicting user intent
 * - Minimizes navigation needed to continue editing
 * - Provides consistent, predictable behavior
 * - Integrates seamlessly with Raycast's form focus system
 *
 * @param colorsLength - Current number of color fields in the form
 * @param draftValues - Optional saved form values for analysis
 *
 * @returns Object containing:
 * - `getFocusField`: Function that returns the optimal field ID for focus
 *
 * @example
 * ```typescript
 * // Basic usage with dynamic color count
 * const { getFocusField } = useFormFocus(3, draftValues);
 * const focusField = getFocusField();
 * // Returns: "color2" (if color1 is filled but color2 is empty)
 *
 * // Integration with form components
 * <Form.TextField
 *   {...itemProps.color1}
 *   autoFocus={getFocusField() === "color1"}
 * />
 * ```
 */
export function useFormFocus(colorsLength: number, draftValues?: PaletteFormFields) {
  /**
   * Analyzes the current form state and determines the optimal field for focus.
   *
   * Uses heuristics based on form completion to predict where the user
   * wants to continue editing, providing a seamless continuation experience.
   *
   * @returns Field ID string for focus, or undefined for default behavior
   */
  const getFocusField = (): string | undefined => {
    // For new forms without draft data, use Raycast's default focus behavior
    if (!draftValues || Object.keys(draftValues).length === 0) {
      return undefined;
    }

    // Analyze color field completion status
    const colorKeys = Object.keys(draftValues).filter((key) => key.startsWith("color"));
    const colorFieldsWithValues = colorKeys.filter((key) => draftValues[key as keyof PaletteFormFields]);

    if (colorFieldsWithValues.length > 0) {
      // Find the highest-numbered color field that has a value
      const lastFilledIndex = Math.max(...colorFieldsWithValues.map((key) => parseInt(key.replace("color", ""))));
      const nextFieldIndex = lastFilledIndex + 1;
      const nextField = `color${nextFieldIndex}`;

      // Focus on the next empty field if it exists
      if (nextFieldIndex <= colorsLength) {
        return nextField;
      } else {
        // All fields are filled, focus on the last field for easy editing
        return `color${colorsLength}`;
      }
    } else {
      // No color fields have values, start with the first color field
      return "color1";
    }
  };

  return {
    getFocusField,
  };
}
