/**
 * Color picker integration utilities for the Color Palette Storage extension.
 *
 * This module provides integration with external color picker tools to enhance
 * the user experience when selecting colors for palettes. It handles the workflow
 * of launching external tools and providing appropriate user feedback.
 */

import { open, showToast, Toast } from "@raycast/api";

/**
 * Launches the external Color Picker extension for color selection.
 *
 * Integrates with Thomas Paul Mann's Color Picker extension to provide a visual
 * color selection interface. The picked color is automatically copied to the
 * clipboard, allowing users to paste it directly into color fields.
 *
 * **Workflow:**
 * 1. Shows user notification about launching color picker
 * 2. Opens the Color Picker extension
 * 3. User selects color visually
 * 4. Color is copied to clipboard automatically
 * 5. User can paste the color into form fields
 *
 * **Dependencies:**
 * - Requires Thomas Paul Mann's Color Picker extension to be installed
 * - Uses Raycast's extension URL scheme for cross-extension communication
 *
 * @throws Will show error toast if the Color Picker extension is not available
 *
 * @example
 * ```typescript
 * // Called when user clicks color picker button
 * await pickColor();
 * // User notification shown, Color Picker opens
 * // Selected color copied to clipboard for pasting
 * ```
 */
export async function pickColor() {
  try {
    // Inform user about the workflow and expected behavior
    showToast({
      style: Toast.Style.Success,
      title: "Opening Color Picker",
      message: "The picked color will be copied to clipboard",
    });

    // Launch the external Color Picker extension
    // Extension URL scheme: raycast://extensions/{author}/{extension-name}/{command}
    open("raycast://extensions/thomas/color-picker/pick-color");
  } catch (error) {
    // Log error for debugging while providing user-friendly feedback
    console.log("Failed to launch color picker:", error);
    showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: "Failed to open Color Picker extension",
    });
  }
}
