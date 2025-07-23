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
  /** Number of color fields to render */
  colorFieldCount: number;
  /** Form item properties from Raycast's useForm hook for validation and binding */
  itemProps: any;
  /** Function to determine which color field should receive focus on load (draft restoration) */
  getColorFieldFocus: () => string | undefined;
  /** Function to create focus handlers for real-time focus tracking */
  createFocusHandlers: (fieldName: string) => { onFocus: () => void; onBlur: () => void };
}

/**
 * Renders a section of dynamic color input fields with intelligent focus and validation.
 *
 * This component creates a clean, user-friendly interface for entering multiple colors
 * in a palette. It uses a simplified approach with a color count instead of managing
 * complex arrays, making the code easier to understand and maintain.
 *
 * **Features:**
 * - Dynamic field rendering based on color count
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
 * @param props.colorFieldCount - Number of color fields to render
 * @param props.itemProps - Form binding properties from useForm hook
 * @param props.getColorFieldFocus - Function to determine auto-focus behavior for color fields
 *
 * @example
 * ```tsx
 * <ColorFieldsSection
 *   colorFieldCount={colorFieldCount}
 *   itemProps={itemProps}
 *   getColorFieldFocus={getColorFieldFocus}
 * />
 * ```
 */
export function ColorFieldsSection({
  colorFieldCount,
  itemProps,
  getColorFieldFocus,
  createFocusHandlers,
}: ColorFieldsSectionProps) {
  return (
    <>
      {/* Visual separator to distinguish color fields section */}
      <Form.Separator />

      {/* Render dynamic color input fields */}
      {Array.from({ length: colorFieldCount }, (_, index) => {
        const colorKey = `color${index + 1}` as keyof PaletteFormFields;
        const shouldFocus = getColorFieldFocus() === colorKey;
        const isRequired = index === 0; // First color field is required
        const focusHandlers = createFocusHandlers(colorKey);

        return (
          <Form.TextField
            key={index}
            {...(itemProps[colorKey] as any)}
            title={`${index + 1}. Color${isRequired ? "*" : ""}`}
            placeholder="e.g., #FF5733, rgb(255, 87, 51), or rgba(255, 87, 51, 0.8)"
            autoFocus={shouldFocus}
            onFocus={focusHandlers.onFocus}
            onBlur={focusHandlers.onBlur}
          />
        );
      })}
    </>
  );
}
