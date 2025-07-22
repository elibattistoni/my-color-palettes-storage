import { open, showToast, Toast } from "@raycast/api";

export async function pickColor() {
  try {
    showToast({
      style: Toast.Style.Success,
      title: "Opening Color Picker",
      message: "The picked color will be copied to clipboard",
    });

    open("raycast://extensions/thomas/color-picker/pick-color");
  } catch (error) {
    console.log("Failed to launch color picker:", error);
    showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: "Failed to open Color Picker extension",
    });
  }
}
