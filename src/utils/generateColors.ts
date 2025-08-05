import { open, showToast, Toast } from "@raycast/api";

/**
 * Opens the Generate Colors command from the Color Picker extension with an optional prompt argument.
 *
 * This function integrates with Thomas Paul Mann's Color Picker extension to provide
 * AI-powered color generation functionality. It can optionally pass a prompt string
 * to guide the color generation process.
 *
 * @param prompt - Optional prompt string to guide color generation (e.g., "ocean sunset", "autumn leaves")
 */
export async function generateColors(prompt?: string) {
  try {
    showToast({
      style: Toast.Style.Success,
      title: "Opening Generate Colors (Color Picker)",
      message: prompt ? `Generating colors with prompt: ${prompt}` : "The generated colors will be copied to clipboard",
    });

    // Build URL with optional prompt argument
    const baseUrl = "raycast://extensions/thomas/color-picker/generate-colors";
    const url = prompt ? `${baseUrl}?arguments=${encodeURIComponent(JSON.stringify({ prompt: prompt }))}` : baseUrl;

    open(url);
  } catch (error) {
    console.log("Failed to launch Color Picker:", error);
    showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: "Failed to open Color Picker extension",
    });
  }
}
