import { open, showToast, Toast } from "@raycast/api";

export async function colorWheel() {
  try {
    showToast({
      style: Toast.Style.Success,
      title: "Opening Color Wheel (Color Picker)",
      message: "The selected color will be copied to clipboard",
    });

    open("raycast://extensions/thomas/color-picker/color-wheel");
  } catch (error) {
    console.log("Failed to launch Color Picker:", error);
    showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: "Failed to open Color Picker extension",
    });
  }
}
