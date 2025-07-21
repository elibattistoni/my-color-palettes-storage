import { showToast, Toast } from "@raycast/api";
import { useLocalStorage } from "@raycast/utils";
import { useState } from "react";
import { ColorPaletteFormFields, SavedPalette } from "../types";

const defaultColors = [{ id: 1, color: "" }];

export function useColorPalette(draftValues?: ColorPaletteFormFields) {
  const [colors, setColors] = useState<{ id: number; color: string }[]>(() => {
    if (draftValues) {
      const colorKeys = Object.keys(draftValues).filter((key) => key.startsWith("color"));
      if (colorKeys.length > 0) {
        return colorKeys.map((_, index) => ({ id: index + 1, color: "" }));
      }
    }
    return defaultColors;
  });

  const { value: colorPalettes, setValue: setColorPalettes } = useLocalStorage<SavedPalette[]>(
    "color-palettes-list",
    [],
  );

  // Determine which field to focus on when opening a draft
  const getFocusField = (): string | undefined => {
    if (draftValues && Object.keys(draftValues).length > 0) {
      // Find all color fields that have values
      const colorKeys = Object.keys(draftValues).filter((key) => key.startsWith("color"));
      const colorFieldsWithValues = colorKeys.filter((key) => draftValues[key as keyof ColorPaletteFormFields]);

      if (colorFieldsWithValues.length > 0) {
        // Focus on the field after the last filled color field
        const lastFilledIndex = Math.max(...colorFieldsWithValues.map((key) => parseInt(key.replace("color", ""))));
        const nextFieldIndex = lastFilledIndex + 1;
        const nextField = `color${nextFieldIndex}`;

        // Check if the next field exists in our colors array
        if (nextFieldIndex <= colors.length) {
          return nextField;
        } else {
          // If no next field, focus on the last available field
          return `color${colors.length}`;
        }
      } else {
        // If no color fields have values, focus on the first color field
        return "color1";
      }
    }
    // For new forms (no draft), don't override default focus
    return undefined;
  };

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

  const clearForm = (reset: (values: any) => void) => {
    setColors(defaultColors);
    reset({
      name: "",
      description: "",
      mode: "",
      keywords: [],
      color1: "",
    });
  };

  const submitPalette = async (values: ColorPaletteFormFields, clearFormFn: () => void, navigateToView: () => void) => {
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

      const updatedPalettes = [palette, ...(colorPalettes ?? [])];
      await setColorPalettes(updatedPalettes);

      showToast({
        style: Toast.Style.Success,
        title: "Success!",
        message: `${values.name} ${values.mode} color palette created with ${colorValues.length} color${colorValues.length > 1 ? "s" : ""}`,
      });

      // Reset form after successful submission
      clearFormFn();

      // Navigate directly to view-color-palettes
      navigateToView();
    } catch (error) {
      console.error("Error saving palette:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Failed to save color palette",
      });
    }
  };

  return {
    colors,
    addColor,
    removeColor,
    clearForm,
    submitPalette,
    getFocusField,
  };
}
