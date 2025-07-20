import { Action, ActionPanel, Form, Icon, LaunchProps, showToast, Toast } from "@raycast/api";
import { FormValidation, useForm, useLocalStorage } from "@raycast/utils";
import { useState } from "react";
import { ColorPaletteFormFields, SavedPalette } from "./types";

// Helper function to validate hex color
const isValidColor = (color: string): boolean => {
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbPattern = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  const rgbaPattern = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/;

  return hexPattern.test(color) || rgbPattern.test(color) || rgbaPattern.test(color);
};

const defaultColors = [{ id: 1, color: "" }];
const defaultFormValues: ColorPaletteFormFields = {
  name: "",
  description: "",
  mode: "",
  keywords: [],
  color1: "",
};

export default function Command(props: LaunchProps<{ draftValues: ColorPaletteFormFields }>) {
  const { draftValues } = props;

  const [colors, setColors] = useState<{ id: number; color: string }[]>(() => {
    if (draftValues) {
      const colorKeys = Object.keys(draftValues).filter((key) => key.startsWith("color"));
      if (colorKeys.length > 0) {
        return colorKeys.map((_, index) => ({ id: index + 1, color: "" }));
      }
    }
    return defaultColors;
  });

  const { value: keywords, setValue: setKeywords } = useLocalStorage<string[]>(
    "color-palettes-keywords",
    draftValues?.keywords || [],
  );

  const { value: colorPalettes, setValue: setColorPalettes } = useLocalStorage<SavedPalette[]>(
    "color-palettes-list",
    [],
  );

  const [updateKeywordsValue, setUpdateKeywordsValue] = useState("");

  const getValidationRules = () => {
    const rules: Record<string, any> = {
      name: FormValidation.Required,
      mode: FormValidation.Required,
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
      try {
        // Extract colors from form values
        const colorValues = colors
          .map((_, index) => values[`color${index + 1}` as keyof ColorPaletteFormFields])
          .filter(Boolean) as string[];

        // Create palette object
        const palette: SavedPalette = {
          id: Date.now().toString(),
          name: values.name,
          description: values.description,
          mode: values.mode as "light" | "dark",
          keywords: values.keywords || [],
          colors: colorValues,
          createdAt: new Date().toISOString(),
        };

        const updatedPalettes = [...(colorPalettes ?? []), palette];
        await setColorPalettes(updatedPalettes);

        showToast({
          style: Toast.Style.Success,
          title: "Success!",
          message: `${values.name} ${values.mode} color palette created with ${colorValues.length} colors`,
        });

        // Reset form after successful submission
        clearForm();
      } catch (error) {
        console.error("Error saving palette:", error);
        showToast({
          style: Toast.Style.Failure,
          title: "Error",
          message: "Failed to save color palette",
        });
      }
    },
    validation: getValidationRules(),
    initialValues: draftValues || defaultFormValues,
  });

  const addColor = () => {
    const nextId = colors.length > 0 ? Math.max(...colors.map((c) => c.id)) + 1 : 1;
    setColors((prev) => [...prev, { id: nextId, color: "" }]);
  };

  const removeColor = (colorId: number) => {
    if (colors.length > 1) {
      // Ensure at least one color remains
      setColors((prev) => prev.filter((c) => c.id !== colorId));
    }
  };

  const clearForm = () => {
    setColors(defaultColors);
    reset(defaultFormValues);
  };

  const updateKeywords = async (keywordsText: string) => {
    const inputKeywords = keywordsText
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    let newKeywords = [...(keywords ?? [])];

    const newlyAddedKeywords = inputKeywords.filter((keyword) => !keyword.startsWith("!"));

    inputKeywords.forEach((keyword) => {
      if (keyword.startsWith("!")) {
        // Remove keyword - extract the keyword name without the '!' prefix
        const tagToRemove = keyword.slice(1);
        newKeywords = newKeywords.filter((existingTag) => existingTag !== tagToRemove);
      } else {
        // Add keyword if it doesn't already exist
        if (!newKeywords.includes(keyword)) {
          newKeywords.push(keyword);
        }
      }
    });

    await setKeywords(newKeywords);

    setFormValues("keywords", (prev) => [...prev, ...newlyAddedKeywords]);
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
          <Action title="Add Color" onAction={addColor} shortcut={{ modifiers: ["cmd"], key: "n" }} />
          {colors.length > 1 && (
            <Action
              title="Remove Last Color"
              onAction={() => removeColor(colors[colors.length - 1].id)}
              shortcut={{ modifiers: ["cmd"], key: "backspace" }}
            />
          )}
          <Action title="Clear Form" onAction={clearForm} shortcut={{ modifiers: ["cmd", "shift"], key: "r" }} />
        </ActionPanel>
      }
      enableDrafts
    >
      <Form.Description text="Insert your Color Palette" />
      <Form.TextField {...itemProps.name} title="Name*" info="Insert the name of your Color Palette" />
      <Form.TextArea
        {...itemProps.description}
        title="Description"
        info="Insert a description or some notes (optional)"
      />
      <Form.Dropdown {...itemProps.mode} title="Mode*">
        <Form.Dropdown.Item value="light" title="Light Color Palette" icon={Icon.Sun} />
        <Form.Dropdown.Item value="dark" title="Dark Color Palette" icon={Icon.Moon} />
      </Form.Dropdown>
      <Form.TagPicker
        {...itemProps.keywords}
        title="Keywords"
        info="Pick one or more Keywords. Keywords will be used to search and filter Color Palettes. If the Keywords list is empty, add them through the Update Keywords field. To remove a keyword from the Keywords list, enter !keyword-to-remove in the Update Keywords field."
      >
        {keywords && keywords.map((keyword, idx) => <Form.TagPicker.Item key={idx} value={keyword} title={keyword} />)}
      </Form.TagPicker>
      <Form.TextField
        id="updateTags"
        title="Update Keywords"
        value={updateKeywordsValue}
        onChange={setUpdateKeywordsValue}
        placeholder="e.g., keyword1, keyword2, !keyword-to-remove"
        info="Enter Keywords separated by commas. Press Tab or move out of focus in order to add them to the Keywords List in the Keywords field above."
        onBlur={async (event) => {
          if (updateKeywordsValue) {
            await updateKeywords(updateKeywordsValue);
            showToast({
              style: Toast.Style.Success,
              title: "Keywords list successfully updated!",
              message: "",
            });
            setUpdateKeywordsValue("");
          }
        }}
      />
      <Form.Separator />

      {colors.map((color, index) => {
        const colorKey = `color${index + 1}` as keyof ColorPaletteFormFields;
        return (
          <Form.TextField
            key={color.id}
            {...(itemProps[colorKey] as any)}
            title={`${index + 1}. Color${index === 0 ? "*" : ""}`}
            placeholder="e.g., #FF5733, rgb(255, 87, 51), or rgba(255, 87, 51, 0.8)"
          />
        );
      })}
    </Form>
  );
}
