/**
 * Application constants for the Color Palette Storage extension.
 *
 * This file contains shared constant values used throughout the application
 * for form initialization, default states, and configuration values.
 */

import { PaletteFormFields } from "./types";

/**
 * Default form values for palette creation form initialization.
 *
 * Used when creating a new palette or resetting the form to its initial state.
 * Provides a clean starting point with one empty color field and empty metadata.
 *
 * @example
 * ```typescript
 * // Reset form to initial state
 * reset(CLEAR_FORM_VALUES);
 * ```
 */
export const CLEAR_FORM_VALUES: PaletteFormFields = {
  /** Default empty name */
  name: "",
  /** Default empty description */
  description: "",
  /** Default unselected mode (user must choose light/dark) */
  mode: "",
  /** Default empty keywords array */
  keywords: [],
  /** Default first color field (empty) */
  color1: "",
};
