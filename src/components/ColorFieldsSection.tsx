/**
 * Color Fields Section Component
 *
 * A reusable component that renders the dynamic color input fields section of the palette form.
 * This component handles the display of multiple color input fields with proper labeling,
 * validation integration, and intelligent focus management.
 */

import { Form } from "@raycast/api";
import { PaletteFormFields } from "../types";

/**
 * Props interface for the ColorFieldsSection component.
 */
interface ColorFieldsSectionProps {
  /** Array of color field objects defining which fields to render */
  colors: { id: number; color: string }[];
  /** Form item properties from Raycast's useForm hook for validation and binding */
  itemProps: any;
  /** Function to determine which field should receive focus on load */
  getFocusField: () => string | undefined;
}

/**
 * Renders a section of dynamic color input fields with intelligent focus and validation.
 *
 * This component creates a clean, user-friendly interface for entering multiple colors
 * in a palette. It integrates with the form validation system and provides clear
 * visual indicators for required fields and supported color formats.
 *
 * **Features:**
 * - Dynamic field rendering based on color array configuration
 * - Automatic field numbering and required field indication
 * - Intelligent focus management for draft restoration
 * - Clear placeholder text showing supported color formats
 * - Seamless integration with form validation system
 * - Visual separation from other form sections
 *
 * **Color Format Support:**
 * - Hex colors: #RGB or #RRGGBB
 * - RGB colors: rgb(r, g, b)
 * - RGBA colors: rgba(r, g, b, a)
 *
 * @param props - Component properties
 * @param props.colors - Array of color field configurations to render
 * @param props.itemProps - Form binding properties from useForm hook
 * @param props.getFocusField - Function to determine auto-focus behavior
 *
 * @example
 * ```tsx
 * <ColorFieldsSection
 *   colors={colors}
 *   itemProps={itemProps}
 *   getFocusField={getFocusField}
 * />
 * ```
 */
export function ColorFieldsSection({ colors, itemProps, getFocusField }: ColorFieldsSectionProps) {
  return (
    <>
      {/* Visual separator to distinguish color fields section */}
      <Form.Separator />

      {/* Render dynamic color input fields */}
      {colors.map((color, index) => {
        const colorKey = `color${index + 1}` as keyof PaletteFormFields;
        const shouldFocus = getFocusField() === colorKey;
        const isRequired = index === 0; // First color field is required

        return (
          <Form.TextField
            key={color.id}
            {...(itemProps[colorKey] as any)}
            title={`${index + 1}. Color${isRequired ? "*" : ""}`}
            placeholder="e.g., #FF5733, rgb(255, 87, 51), or rgba(255, 87, 51, 0.8)"
            autoFocus={shouldFocus}
          />
        );
      })}
    </>
  );
}
