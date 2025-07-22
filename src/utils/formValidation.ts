/**
 * Form validation utilities for the Color Palette Storage extension.
 *
 * This module provides pure validation functions that can be easily tested
 * and reused across different form contexts. It separates validation logic
 * from UI components for better maintainability and testability.
 */

import { FormValidation } from "@raycast/utils";
import { Color } from "../types";
import { isValidColor } from "./isValidColor";

/**
 * Creates comprehensive validation rules for the color palette form.
 *
 * Generates dynamic validation rules based on the current color field configuration.
 * Ensures data quality and provides clear user feedback for invalid inputs.
 * The function creates rules for both static fields and dynamic color fields.
 *
 * **Validation Rules:**
 * - Name: Required, max 15 characters
 * - Mode: Required selection (light/dark)
 * - Description: Optional, max 50 characters
 * - Colors: First color required and valid, others optional but must be valid if provided
 *
 * @param colors - Array of color field objects to create validation rules for
 * @returns Object containing validation functions keyed by field names
 *
 * @example
 * ```typescript
 * const colors = [{ id: 1, color: "" }, { id: 2, color: "" }];
 * const rules = createValidationRules(colors);
 * // Returns: { name: Function, mode: Required, description: Function, color1: Function, color2: Function }
 * ```
 */
export function createValidationRules(colors: Color[]) {
  // Initialize with static field validation rules
  const rules: Record<string, any> = {
    /** Name field validation: required with character limit */
    name: (value: string) => {
      if (!value) {
        return FormValidation.Required;
      }
      if (value.length >= 16) {
        return "Characters limit exceeded. Keep it under 15 characters.";
      }
    },
    /** Mode field validation: required selection */
    mode: FormValidation.Required,
    /** Description field validation: optional with character limit */
    description: (value: string) => {
      if (value && value.length >= 51) {
        return "Characters limit exceeded. Keep it under 50 characters.";
      }
    },
  };

  // Dynamically add validation rules for each color field
  colors.forEach((_, index) => {
    const colorKey = `color${index + 1}`;
    if (index === 0) {
      // First color field: required and must be a valid color format
      rules[colorKey] = (value: string) => {
        if (!value) {
          return "At least one color is required";
        }
        if (!isValidColor(value)) {
          return "Please enter a valid color (hex, rgb, or rgba)";
        }
      };
    } else {
      // Additional color fields: optional but must be valid if provided
      rules[colorKey] = (value: string) => {
        if (value && !isValidColor(value)) {
          return "Please enter a valid color (hex, rgb, or rgba)";
        }
      };
    }
  });

  return rules;
}
