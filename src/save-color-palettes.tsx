import { Form, Icon, LaunchProps, open, showToast, Toast } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import { ColorFieldsSection } from "./components/ColorFieldsSection";
import { ColorPaletteActions } from "./components/ColorPaletteActions";
import { KeywordsSection } from "./components/KeywordsSection";
import { useColorPalette } from "./hooks/useColorPalette";
import { useKeywords } from "./hooks/useKeywords";
import { ColorPaletteFormFields } from "./types";
import { isValidColor } from "./utils";

const defaultFormValues: ColorPaletteFormFields = {
  name: "",
  description: "",
  mode: "",
  keywords: [],
  color1: "",
};

export default function Command(props: LaunchProps<{ draftValues: ColorPaletteFormFields }>) {
  const { draftValues } = props;

  // Custom hooks
  const { colors, addColor, removeColor, clearForm, submitPalette, getFocusField } = useColorPalette(draftValues);
  const { keywords, updateKeywords } = useKeywords(draftValues);

  async function pickColor() {
    try {
      showToast({
        style: Toast.Style.Success,
        title: "Opening Color Picker",
        message: "The picked color will be copied to clipboard",
      });

      await open("raycast://extensions/thomas/color-picker/pick-color");
    } catch (error) {
      console.log("Failed to launch color picker:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Failed to open color picker extension",
      });
    }
  }

  const getValidationRules = () => {
    const rules: Record<string, any> = {
      name: (value: string) => {
        if (!value) {
          return FormValidation.Required;
        } else {
          if (value.length >= 16) {
            return "Characters limit exceeded. Keep it under 15 characters.";
          }
        }
      },
      mode: FormValidation.Required,
      description: (value: string) => {
        if (value && value.length >= 51) {
          return "Characters limit exceeded. Keep it under 50 characters.";
        }
      },
    };

    // Add validation for each color field
    colors.forEach((_, index) => {
      const colorKey = `color${index + 1}`;
      if (index === 0) {
        // First color is required and must be valid
        rules[colorKey] = (value: string) => {
          if (!value) {
            return "At least one color is required";
          }
          if (!isValidColor(value)) {
            return "Please enter a valid color (hex, rgb, or rgba)";
          }
        };
      } else {
        // Other colors are optional but must be valid if provided
        rules[colorKey] = (value: string) => {
          if (value && !isValidColor(value)) {
            return "Please enter a valid color (hex, rgb, or rgba)";
          }
        };
      }
    });

    return rules;
  };

  const {
    handleSubmit,
    itemProps,
    reset,
    setValue: setFormValues,
  } = useForm<ColorPaletteFormFields>({
    async onSubmit(values) {
      const clearFormFn = () => clearForm(reset);
      const navigateToView = () =>
        open("raycast://extensions/elibattistoni/my-color-palettes-storage/view-color-palettes");
      await submitPalette(values, clearFormFn, navigateToView);
    },
    validation: getValidationRules(),
    initialValues: draftValues || defaultFormValues,
  });

  const handleUpdateKeywords = async (keywordsText: string) => {
    await updateKeywords(keywordsText, setFormValues);
  };

  return (
    <Form
      actions={
        <ColorPaletteActions
          handleSubmit={handleSubmit}
          addColor={addColor}
          removeColor={removeColor}
          pickColor={pickColor}
          clearForm={() => clearForm(reset)}
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
