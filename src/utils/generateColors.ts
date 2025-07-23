import { open, showToast, Toast } from "@raycast/api";

export async function generateColors() {
  try {
    showToast({
      style: Toast.Style.Success,
      title: "Opening Generate Colors (Color Picker)",
      message: "The generated colors will be copied to clipboard",
    });

    open("raycast://extensions/thomas/color-picker/generate-colors");
  } catch (error) {
    console.log("Failed to launch Color Picker:", error);
    showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: "Failed to open Color Picker extension",
    });
  }
}
