/**
 * Custom hook for intelligent color field focus management during draft restoration.
 *
 * This hook provides smart focus behavior specifically for color fields when restoring
 * forms from draft values. It analyzes the completion state of color fields and
 * determines the optimal color field to focus, improving user experience by positioning
 * the cursor where they're most likely to continue editing their color palette.
 *
 * **Important**: This hook is specifically designed for:
 * - Color fields only (color1, color2, color3, etc.)
 * - Draft restoration scenarios only
 * - Does NOT handle other form fields (name, description, mode, keywords)
 */

import { PaletteFormFields } from "../types";

/**
 * Manages color field focus behavior for draft restoration scenarios.
 *
 * When users return to edit a saved draft, this hook determines which COLOR field
 * should receive initial focus based on the current completion state of color fields.
 * It implements intelligent logic to position the cursor where the user is most likely
 * to continue their color palette work.
 *
 * **Scope & Limitations:**
 * - ONLY handles color fields (color1, color2, color3, etc.)
 * - ONLY works with draft values (existing form data)
 * - Does NOT manage focus for other fields (name, description, mode, keywords)
 * - New forms without drafts use Raycast's default focus behavior
 *
 * **Color Field Focus Logic:**
 * 1. New forms (no draft): Returns undefined → Raycast default focus
 * 2. Draft with color values: Focus on the first empty color field after filled ones
 * 3. All color fields filled: Focus on the last color field for easy modification
 * 4. No color values in draft: Focus on the first color field (color1)
 *
 * **Benefits:**
 * - Reduces cognitive load by predicting user intent for color editing
 * - Minimizes navigation needed to continue palette creation
 * - Provides consistent, predictable behavior for color field workflow
 * - Integrates seamlessly with Raycast's form focus system
 *
 * @param colorFieldCount - Current number of color fields in the form
 * @param draftValues - Optional saved form values for color field analysis
 *
 * @returns Object containing:
 * - `getColorFieldFocus`: Function that returns the optimal color field ID for focus
 *
 * @example
 * ```typescript
 * // Basic usage with dynamic color field count
 * const { getColorFieldFocus } = useDraftColorFieldFocus(3, draftValues);
 * const focusField = getColorFieldFocus();
 * // Returns: "color2" (if color1 is filled but color2 is empty)
 *
 * // Integration with color field components
 * <Form.TextField
 *   {...itemProps.color1}
 *   autoFocus={getColorFieldFocus() === "color1"}
 * />
 * ```
 */
export function useDraftColorFieldFocus(colorFieldCount: number, draftValues?: PaletteFormFields) {
  /**
   * Analyzes the current draft state and determines the optimal COLOR field for focus.
   *
   * Uses heuristics based on color field completion to predict where the user
   * wants to continue editing their color palette, providing a seamless continuation experience.
   *
   * @returns Color field ID string for focus (e.g., "color1", "color2"), or undefined for default behavior
   */
  const getDraftColorFieldFocus = (): string | undefined => {
    // For new forms without draft data, use Raycast's default focus behavior
    if (!draftValues || Object.keys(draftValues).length === 0) {
      return undefined;
    }

    // Analyze color field completion status (only color fields, not other form fields)
    const colorKeys = Object.keys(draftValues).filter((key) => key.startsWith("color"));
    const colorFieldsWithValues = colorKeys.filter((key) => draftValues[key as keyof PaletteFormFields]);

    if (colorFieldsWithValues.length > 0) {
      // Find the highest-numbered color field that has a value
      const lastFilledIndex = Math.max(...colorFieldsWithValues.map((key) => parseInt(key.replace("color", ""))));
      const nextFieldIndex = lastFilledIndex + 1;
      const nextField = `color${nextFieldIndex}`;

      // Focus on the next empty color field if it exists
      if (nextFieldIndex <= colorFieldCount) {
        return nextField;
      } else {
        // All color fields are filled, focus on the last color field for easy editing
        return `color${colorFieldCount}`;
      }
    } else {
      // No color fields have values, start with the first color field
      return "color1";
    }
  };

  return {
    getDraftColorFieldFocus,
  };
}
