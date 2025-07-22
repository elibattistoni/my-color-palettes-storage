import { open, showToast, Toast } from "@raycast/api";
import { useLocalStorage } from "@raycast/utils";
import { PaletteFormFields, StoredPalette } from "../types";

/**
 * Custom hook for handling color palette submission and persistence logic.
 *
 * This hook encapsulates all the complex operations required to save a color palette,
 * including local storage management, data transformation, user feedback, and navigation.
 * It provides a clean interface for form components to submit palette data without
 * handling the underlying storage and navigation complexity.
 *
 * **Responsibilities:**
 * - Transforms form data into persistable storage format
 * - Manages local storage operations for palette persistence
 * - Generates unique IDs and timestamps for new palettes
 * - Provides user feedback through toast notifications
 * - Handles post-submission navigation to the palettes view
 * - Manages error handling and recovery for failed submissions
 * - Executes success callbacks for form cleanup operations
 *
 * **Integration Points:**
 * - Uses Raycast's local storage utilities for data persistence
 * - Integrates with Raycast's toast system for user notifications
 * - Handles navigation between extension commands
 * - Coordinates with form components through callback functions
 *
 * @returns An object containing:
 * - `submitPalette`: Async function to save a palette and handle all side effects
 *
 * @example
 * ```typescript
 * // Basic usage in a form component
 * const { submitPalette } = usePaletteSubmission();
 *
 * const handleSubmit = async (formValues: PaletteFormFields) => {
 *   const colorValues = extractColorsFromForm(formValues);
 *   await submitPalette(formValues, colorValues, () => {
 *     // Form cleanup logic (reset, clear drafts, etc.)
 *     form.reset();
 *   });
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Example of data transformation:
 * // Input: { name: "Sunset", mode: "light", color1: "#FF5733", color2: "#FFC300" }
 * // Output: StoredPalette {
 * //   id: "1642584000000",
 * //   name: "Sunset",
 * //   mode: "light",
 * //   colors: ["#FF5733", "#FFC300"],
 * //   createdAt: "2025-01-19T10:00:00.000Z"
 * // }
 * ```
 */
export function usePaletteSubmission() {
  // Access local storage for palette persistence using Raycast's utilities
  // The storage key "color-palettes-list" is shared across the extension
  const { value: colorPalettes, setValue: setColorPalettes } = useLocalStorage<StoredPalette[]>(
    "color-palettes-list",
    [],
  );

  /**
   * Submits a color palette by saving it to local storage and handling all side effects.
   *
   * This function orchestrates the entire submission process including data transformation,
   * persistence, user feedback, navigation, and error handling. It ensures data consistency
   * and provides a smooth user experience during palette creation.
   *
   * **Process Flow:**
   * 1. Transform form data into storage-ready format
   * 2. Generate unique ID and timestamp
   * 3. Prepend new palette to existing list (newest first)
   * 4. Persist to local storage
   * 5. Show success notification with details
   * 6. Execute form cleanup callback
   * 7. Navigate to palettes view
   * 8. Handle any errors with user-friendly messages
   *
   * @param values - The validated form data containing palette information
   * @param colorValues - Array of color hex codes extracted from form fields
   * @param onSuccess - Callback function executed after successful save (for form cleanup)
   *
   * @throws Will catch and handle any storage or navigation errors internally
   *
   * @example
   * ```typescript
   * await submitPalette(
   *   { name: "Ocean", mode: "light", description: "Beach vibes" },
   *   ["#1E90FF", "#87CEEB", "#F0F8FF"],
   *   () => form.reset()
   * );
   * ```
   */
  const submitPalette = async (values: PaletteFormFields, colorValues: string[], onSuccess: () => void) => {
    try {
      // Transform form data into the storage format with generated metadata
      const palette: StoredPalette = {
        id: Date.now().toString(), // Simple timestamp-based ID (sufficient for personal use)
        name: values.name,
        description: values.description,
        mode: values.mode as "light" | "dark", // Type assertion for validated enum value
        keywords: values.keywords || [], // Default to empty array if no keywords provided
        colors: colorValues, // Pre-validated hex color array
        createdAt: new Date().toISOString(), // ISO timestamp for consistent date handling
      };

      // Prepend new palette to maintain chronological order (newest first)
      const updatedPalettes = [palette, ...(colorPalettes ?? [])];
      await setColorPalettes(updatedPalettes);

      // Provide detailed success feedback to user
      showToast({
        style: Toast.Style.Success,
        title: "Success!",
        message: `${values.name} ${values.mode} color palette created with ${colorValues.length} color${colorValues.length > 1 ? "s" : ""}`,
      });

      // Execute form cleanup operations (reset fields, clear drafts, etc.)
      onSuccess();

      // Navigate to the view palettes command to show the newly created palette
      await open("raycast://extensions/elibattistoni/my-color-palettes-storage/view-color-palettes");
    } catch (error) {
      // Log error for debugging while showing user-friendly message
      console.error("Error saving palette:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Failed to save color palette",
      });
      // Note: We don't re-throw the error to prevent form component crashes
      // The error is logged and user is notified, allowing them to retry
    }
  };

  return {
    submitPalette,
  };
}
