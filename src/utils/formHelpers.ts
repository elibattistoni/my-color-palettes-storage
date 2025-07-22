/**
 * Form helper utilities for the Color Palette Storage extension.
 *
 * This module provides utility functions for form data transformation and manipulation.
 * These pure functions help convert between different data representations used throughout
 * the application (form state vs storage format vs UI state).
 */

import { Color, PaletteFormFields } from "../types";

/**
 * Extracts color values from form data based on the current color field configuration.
 *
 * Transforms the form's dynamic color fields (color1, color2, etc.) into a clean
 * array of color values, filtering out any empty or undefined values. This function
 * bridges the gap between form state and the storage format.
 *
 * **Process:**
 * 1. Maps over the color field configuration to determine which fields to extract
 * 2. Retrieves values from form data using dynamic field names (color1, color2, etc.)
 * 3. Filters out falsy values (empty strings, undefined, null)
 * 4. Returns clean array of valid color strings
 *
 * @param values - The complete form data object containing all field values
 * @param colors - Array of color field objects defining which fields to extract
 * @returns Array of non-empty color strings ready for storage
 *
 * @example
 * ```typescript
 * const formData = { name: "Ocean", color1: "#1E90FF", color2: "", color3: "#87CEEB" };
 * const colors = [{ id: 1, color: "" }, { id: 2, color: "" }, { id: 3, color: "" }];
 * const result = extractColorValues(formData, colors);
 * // Returns: ["#1E90FF", "#87CEEB"] (empty color2 filtered out)
 * ```
 */
export function extractColorValues(values: PaletteFormFields, colors: Color[]): string[] {
  return colors.map((_, index) => values[`color${index + 1}` as keyof PaletteFormFields]).filter(Boolean) as string[];
}
