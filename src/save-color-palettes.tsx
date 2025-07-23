import { Form, Icon, LaunchProps } from "@raycast/api";
import { useForm } from "@raycast/utils";
import { ColorFieldsSection } from "./components/ColorFieldsSection";
import { ColorPaletteActions } from "./components/ColorPaletteActions";
import { KeywordsSection } from "./components/KeywordsSection";
import { CLEAR_FORM_VALUES } from "./constants";
import { useColorFields } from "./hooks/useColorFields";
import { useDraftColorFieldFocus } from "./hooks/useFormFocus";
import { useKeywords } from "./hooks/useKeywords";
import { usePaletteSubmission } from "./hooks/usePaletteSubmission";
import { useRealTimeFocus } from "./hooks/useRealTimeFocus";
import { PaletteFormFields } from "./types";
import { createValidationRules } from "./utils/formValidation";

/**
 * Color Palette Creation Command
 *
 * This is the main command component for creating new color palettes in the Raycast extension.
 * It provides a comprehensive form interface with dynamic fields, validation, and draft support.
 *
 * **Architecture:**
 * - Built using React functional components with custom hooks
 * - Follows separation of concerns with dedicated hooks for different responsibilities
 * - Uses Raycast's Form API with proper validation and draft management
 * - Implements clean component composition with reusable UI sections
 *
 * **Key Features:**
 * - Dynamic color field management (add/remove colors)
 * - Real-time form validation with custom rules
 * - Draft persistence for interrupted sessions
 * - Color picker integration for easy color selection
 * - Keyword tagging system for palette organization
 * - Automatic focus management for better UX
 * - Toast notifications and navigation after submission
 *
 * **Data Flow:**
 * 1. Form state managed by Raycast's useForm hook
 * 2. Color fields managed by custom useColorPalette hook
 * 3. Keywords managed by dedicated useKeywords hook
 * 4. Submission handled by usePaletteSubmission hook
 * 5. Focus behavior controlled by useFormFocus hook
 *
 * **Component Structure:**
 * ```
 * Command (main orchestrator)
 * ├── ColorPaletteActions (action buttons)
 * ├── KeywordsSection (keyword management)
 * └── ColorFieldsSection (dynamic color inputs)
 * ```
 *
 * @param props - Launch properties including optional draft values for form restoration
 * @param props.draftValues - Previously saved form data for resuming interrupted sessions
 *
 * @example
 * ```tsx
 * // Called by Raycast when user activates the command
 * <Command draftValues={savedDraft} />
 * ```
 */
export default function Command(props: LaunchProps<{ draftValues: PaletteFormFields }>) {
  const { draftValues } = props;

  // === State Management Hooks ===
  // Each hook has a single responsibility following React best practices

  /** Manages dynamic color field state (add/remove/clear color field UI) */
  const { colorFieldCount, addColorField, removeColorField, resetColorFields } = useColorFields(draftValues);

  /** Handles keyword parsing and management for palette tagging */
  const { keywords, updateKeywords } = useKeywords(draftValues);

  /** Encapsulates palette submission, storage, and navigation logic */
  const { submitPalette } = usePaletteSubmission();

  /** Determines which color field should receive focus based on draft state */
  const { getDraftColorFieldFocus } = useDraftColorFieldFocus(colorFieldCount, draftValues);

  /** Tracks currently focused form field in real-time */
  const { currentFocusedField, createFocusHandlers } = useRealTimeFocus();

  // === Local Event Handlers ===

  /**
   * Resets the entire form to its initial state.
   * Clears both color fields and form values for a fresh start.
   */
  const handleClearForm = () => {
    resetColorFields();
    reset(CLEAR_FORM_VALUES);
  };

  // === Form Management ===
  // Raycast's form hook with custom validation and submission handling
  const {
    handleSubmit,
    itemProps,
    reset,
    setValue: setFormValues,
    values,
  } = useForm<PaletteFormFields>({
    async onSubmit(values) {
      // Submit palette with simplified object-based API
      await submitPalette({
        formValues: values,
        colorCount: colorFieldCount,
        onSubmit: handleClearForm,
      });
    },
    validation: createValidationRules(colorFieldCount),
    initialValues: draftValues || CLEAR_FORM_VALUES,
  });

  // === Local Event Handlers ===

  /**
   * Removes the last color field and clears its value from the form.
   *
   * This function solves the issue where removing a color field would only hide it from the UI
   * but leave the form value in memory. When a new field was added later, it would pick up
   * the old value that was never cleared.
   *
   * **Fix Steps:**
   * 1. Clear the form value for the last color field
   * 2. Decrement the color field count (which hides the field from UI)
   *
   * This ensures complete cleanup when removing color fields.
   */
  const handleRemoveColorField = () => {
    if (colorFieldCount > 1) {
      // Clear the value of the last color field before removing it
      const lastColorField = `color${colorFieldCount}` as keyof PaletteFormFields;
      setFormValues(lastColorField, "");

      // Remove the color field from the UI
      removeColorField();
    }
  };

  /**
   * Handles keyword input parsing and form state updates.
   * Parses comma-separated keywords and updates both local state and form.
   *
   * @param keywordsText - Raw comma-separated keyword string from user input
   */
  const handleUpdateKeywords = async (keywordsText: string) => {
    const updatedKeywords = await updateKeywords(keywordsText);
    setFormValues("keywords", (prev: string[]) => [...prev, ...updatedKeywords]);
  };

  /**
   * Gets the currently focused color with both ID and value based on form focus and form values.
   * Returns the color index (1-based) and value from the focused field, or the first color if none focused.
   */
  const getCurrentColor = (): { id: number; value: string } | undefined => {
    const focusedField = currentFocusedField;
    if (focusedField && focusedField.startsWith("color")) {
      // Extract the color index from the field name (e.g., "color1" -> 1)
      const colorIndex = parseInt(focusedField.replace("color", ""));
      const fieldValue = values[focusedField as keyof PaletteFormFields];

      // Ensure we only return valid color data with string values
      if (colorIndex <= colorFieldCount && typeof fieldValue === "string" && fieldValue) {
        return { id: colorIndex, value: fieldValue };
      }
    }
    // Fallback to first color if no specific focus
    const firstColorValue = values.color1;
    if (typeof firstColorValue === "string" && firstColorValue) {
      return { id: 1, value: firstColorValue };
    }
    return undefined;
  };

  return (
    <Form
      actions={
        <ColorPaletteActions
          handleSubmit={handleSubmit}
          addColor={addColorField}
          removeColor={handleRemoveColorField}
          clearForm={handleClearForm}
          colorFieldCount={colorFieldCount}
          currentColor={getCurrentColor()}
        />
      }
      enableDrafts
    >
      <Form.Description text="Insert your Color Palette" />
      <Form.TextField
        {...itemProps.name}
        title="Name*"
        info="Insert the name of your Color Palette"
        {...createFocusHandlers("name")}
      />
      <Form.TextArea
        {...itemProps.description}
        title="Description"
        info="Insert a short description (optional). It should be under 50 characters."
        {...createFocusHandlers("description")}
      />
      <Form.Dropdown {...itemProps.mode} title="Mode*" {...createFocusHandlers("mode")}>
        <Form.Dropdown.Item value="light" title="Light Color Palette" icon={Icon.Sun} />
        <Form.Dropdown.Item value="dark" title="Dark Color Palette" icon={Icon.Moon} />
      </Form.Dropdown>
      <KeywordsSection
        keywords={keywords}
        itemProps={itemProps}
        updateKeywords={handleUpdateKeywords}
        createFocusHandlers={createFocusHandlers}
      />
      <ColorFieldsSection
        colorFieldCount={colorFieldCount}
        itemProps={itemProps}
        getColorFieldFocus={getDraftColorFieldFocus}
        createFocusHandlers={createFocusHandlers}
      />
    </Form>
  );
}
