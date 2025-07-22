import { Form, Icon, LaunchProps } from "@raycast/api";
import { useForm } from "@raycast/utils";
import { ColorFieldsSection } from "./components/ColorFieldsSection";
import { ColorPaletteActions } from "./components/ColorPaletteActions";
import { KeywordsSection } from "./components/KeywordsSection";
import { CLEAR_FORM_VALUES } from "./constants";
import { useColorPalette } from "./hooks/useColorPalette";
import { useFormFocus } from "./hooks/useFormFocus";
import { useKeywords } from "./hooks/useKeywords";
import { usePaletteSubmission } from "./hooks/usePaletteSubmission";
import { PaletteFormFields } from "./types";
import { extractColorValues } from "./utils/formHelpers";
import { createValidationRules } from "./utils/formValidation";
import { pickColor } from "./utils/pickColor";

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

  /** Manages dynamic color field state (add/remove/clear color inputs) */
  const { colors, addColor, removeColor, clearColors } = useColorPalette(draftValues);

  /** Handles keyword parsing and management for palette tagging */
  const { keywords, updateKeywords } = useKeywords(draftValues);

  /** Encapsulates palette submission, storage, and navigation logic */
  const { submitPalette } = usePaletteSubmission();

  /** Determines which form field should receive focus based on form state */
  const { getFocusField } = useFormFocus(colors.length, draftValues);

  // === Form Management ===
  // Raycast's form hook with custom validation and submission handling
  const {
    handleSubmit,
    itemProps,
    reset,
    setValue: setFormValues,
  } = useForm<PaletteFormFields>({
    async onSubmit(values) {
      // Extract color values from form data and submit
      const colorValues = extractColorValues(values, colors);
      await submitPalette(values, colorValues, clearForm);
    },
    validation: createValidationRules(colors),
    initialValues: draftValues || CLEAR_FORM_VALUES,
  });

  // === Local Event Handlers ===

  /**
   * Resets the entire form to its initial state.
   * Clears both color fields and form values for a fresh start.
   */
  const clearForm = () => {
    clearColors();
    reset(CLEAR_FORM_VALUES);
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

  return (
    <Form
      actions={
        <ColorPaletteActions
          handleSubmit={handleSubmit}
          addColor={addColor}
          removeColor={removeColor}
          pickColor={pickColor}
          clearForm={clearForm}
          colors={colors}
        />
      }
      enableDrafts
    >
      <Form.Description text="Insert your Color Palette" />
      <Form.TextField {...itemProps.name} title="Name*" info="Insert the name of your Color Palette" />
      <Form.TextArea
        {...itemProps.description}
        title="Description"
        info="Insert a short description (optional). It should be under 50 characters."
      />
      <Form.Dropdown {...itemProps.mode} title="Mode*">
        <Form.Dropdown.Item value="light" title="Light Color Palette" icon={Icon.Sun} />
        <Form.Dropdown.Item value="dark" title="Dark Color Palette" icon={Icon.Moon} />
      </Form.Dropdown>
      <KeywordsSection keywords={keywords} itemProps={itemProps} updateKeywords={handleUpdateKeywords} />
      <ColorFieldsSection colors={colors} itemProps={itemProps} getFocusField={getFocusField} />
    </Form>
  );
}
