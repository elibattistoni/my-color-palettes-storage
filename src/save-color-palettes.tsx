import { Form, Icon, LaunchProps } from "@raycast/api";
import { useForm } from "@raycast/utils";
import { ColorFieldsSection } from "./components/ColorFieldsSection";
import { ColorPaletteActions } from "./components/ColorPaletteActions";
import { KeywordsSection } from "./components/KeywordsSection";
import { CLEAR_FORM_VALUES } from "./constants";
import { useColorFields } from "./hooks/useColorFields";
import { useKeywords } from "./hooks/useKeywords";
import { usePaletteSubmission } from "./hooks/usePaletteSubmission";
import { useRealTimeFocus } from "./hooks/useRealTimeFocus";
import { PaletteFormFields } from "./types";
import { createValidationRules } from "./utils/formValidation";

/**
 * Color Palette Creation Command
 *
 * Main form component for creating color palettes with dynamic fields, validation, and draft support.
 * Uses custom hooks for separation of concerns and clean component composition.
 *
 * @param props.draftValues - Previously saved form data for resuming interrupted sessions
 */
export default function Command(props: LaunchProps<{ draftValues: PaletteFormFields }>) {
  const { draftValues } = props;

  // === State Management Hooks ===
  // Each hook has a single responsibility following React best practices

  /** Manages dynamic color field state */
  const { colorFieldCount, addColorField, removeColorField, resetColorFields } = useColorFields(draftValues);

  /** Handles keyword parsing and management */
  const { keywords, updateKeywords } = useKeywords(draftValues);

  /** Encapsulates palette submission logic */
  const { submitPalette } = usePaletteSubmission();

  /** Tracks currently focused form field and manages draft restoration */
  const { currentFocusedField, effectiveFocusedField, createFocusHandlers, setFocusedField } = useRealTimeFocus();

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

  // === Helper Functions ===

  /**
   * Calculates which field should get autoFocus for draft restoration.
   * Determines the next logical field to focus based on existing draft values.
   */
  const getAutoFocusField = (): string | null => {
    if (!draftValues || Object.keys(draftValues).length === 0) {
      return null;
    }

    const colorKeys = Object.keys(draftValues).filter((key) => key.startsWith("color"));
    const colorFieldsWithValues = colorKeys.filter((key) => draftValues[key as keyof PaletteFormFields]);

    if (colorFieldsWithValues.length > 0) {
      const lastFilledIndex = Math.max(...colorFieldsWithValues.map((key) => parseInt(key.replace("color", ""))));
      const nextFieldIndex = lastFilledIndex + 1;
      return nextFieldIndex <= colorFieldCount ? `color${nextFieldIndex}` : `color${colorFieldCount}`;
    } else {
      return "color1";
    }
  };

  /**
   * Gets the effectively focused color with ID and value, or fallback to first color.
   * Uses effective focus (current or last focused field) to maintain context during action panel interactions.
   */
  const getEffectiveFocusedColor = (): { id: number; value: string } | undefined => {
    const focusedField = effectiveFocusedField;
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

  const autoFocusField = getAutoFocusField();

  // === Local Event Handlers ===

  /**
   * Resets the entire form to its initial state.
   */
  const handleClearForm = () => {
    resetColorFields();
    reset(CLEAR_FORM_VALUES);
  };

  // === Local Event Handlers ===

  /**
   * Adds a new color field and focuses on it for immediate input.
   */
  const handleAddColorField = () => {
    // Add the new color field
    addColorField();

    // Focus on the newly added color field with a slight delay to ensure DOM is updated
    setTimeout(() => {
      const newColorField = `color${colorFieldCount + 1}`;
      setFocusedField(newColorField);
    }, 0);
  };

  /**
   * Removes the last color field and clears its form value.
   * Ensures complete cleanup when removing color fields and sets focus to the new last color field.
   */
  const handleRemoveColorField = () => {
    if (colorFieldCount > 1) {
      // Clear the value of the last color field before removing it
      const lastColorField = `color${colorFieldCount}` as keyof PaletteFormFields;
      setFormValues(lastColorField, "");

      // Remove the color field from the UI
      removeColorField();

      // Focus on the new last color field after removal
      const newLastColorField = `color${colorFieldCount - 1}`;
      setFocusedField(newLastColorField);
    }
  };

  /**
   * Handles keyword input parsing and form state updates.
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
          addColor={handleAddColorField}
          removeColor={handleRemoveColorField}
          clearForm={handleClearForm}
          colorFieldCount={colorFieldCount}
          focusedColor={getEffectiveFocusedColor()}
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
        autoFocusField={autoFocusField}
        currentFocusedField={currentFocusedField}
        createFocusHandlers={createFocusHandlers}
      />
    </Form>
  );
}
