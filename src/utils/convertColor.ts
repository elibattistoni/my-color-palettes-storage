import { open, showToast, Toast } from "@raycast/api";

/**
 * Opens the Convert Color command from the Color Picker extension with an optional color argument.
 *
 * This function integrates with Thomas Paul Mann's Color Picker extension to provide
 * color conversion functionality. It can optionally pass a color value as an argument
 * to pre-populate the conversion interface.
 *
 * @param colorValue - Optional color string to convert (hex, rgb, rgba, etc.)
 */
export async function convertColor(colorValue?: string) {
  try {
    showToast({
      style: Toast.Style.Success,
      title: "Opening Convert Color (Color Picker)",
      message: colorValue ? `Converting color: ${colorValue}` : "The converted color will be copied to clipboard",
    });

    // Build URL with optional color argument
    const baseUrl = "raycast://extensions/thomas/color-picker/convert-color";
    const url = colorValue
      ? `${baseUrl}?arguments=${encodeURIComponent(JSON.stringify({ text: colorValue }))}`
      : baseUrl;

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
