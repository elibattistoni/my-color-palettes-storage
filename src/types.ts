/**
 * Type definitions for the Color Palette Storage extension.
 *
 * This file contains all TypeScript type definitions used throughout the extension
 * for type safety, IntelliSense support, and better code maintainability.
 */

/**
 * Represents a color field in the dynamic form UI.
 *
 * Used by the useColorPalette hook to manage dynamic color input fields.
 * The ID provides stable React keys and the color field is typically empty
 * as actual values are managed by the form state.
 *
 * @example
 * ```typescript
 * const colorField: Color = { id: 1, color: "" };
 * ```
 */
export type Color = {
  /** Unique identifier for the color field (used for React keys and removal) */
  id: number;
  /** Color value placeholder (actual values stored in form state) */
  color: string;
};

/**
 * Form data structure for palette creation and editing.
 *
 * Represents the complete form state including both fixed fields and dynamic
 * color fields. The dynamic color fields use template literal types to ensure
 * type safety for fields like "color1", "color2", etc.
 *
 * @example
 * ```typescript
 * const formData: PaletteFormFields = {
 *   name: "Ocean Theme",
 *   description: "Blue ocean colors",
 *   mode: "light",
 *   keywords: ["blue", "ocean", "nature"],
 *   color1: "#1E90FF",
 *   color2: "#87CEEB",
 *   color3: "#F0F8FF"
 * };
 * ```
 */
export type PaletteFormFields = {
  /** Display name for the color palette */
  name: string;
  /** Optional description of the palette's purpose or theme */
  description: string;
  /** Visual mode the palette is designed for */
  mode: string;
  /** Array of tags/keywords for organization and search */
  keywords: string[];
  /** Dynamic color fields with numbered keys (color1, color2, etc.) */
  [key: `color${number}`]: string;
};

/**
 * Persisted palette data structure for local storage.
 *
 * Represents how color palettes are stored in local storage with all metadata
 * needed for display, search, and management. This is the normalized format
 * that transforms form data into a storage-optimized structure.
 *
 * @example
 * ```typescript
 * const storedPalette: StoredPalette = {
 *   id: "1642584000000",
 *   name: "Ocean Theme",
 *   description: "Blue ocean colors",
 *   mode: "light",
 *   keywords: ["blue", "ocean", "nature"],
 *   colors: ["#1E90FF", "#87CEEB", "#F0F8FF"],
 *   createdAt: "2025-01-19T10:00:00.000Z"
 * };
 * ```
 */
export type StoredPalette = {
  /** Unique identifier (timestamp-based for simplicity) */
  id: string;
  /** Display name for the color palette */
  name: string;
  /** Optional description of the palette's purpose or theme */
  description: string;
  /** Visual mode the palette is designed for (strictly typed) */
  mode: "light" | "dark";
  /** Array of tags/keywords for organization and search */
  keywords: string[];
  /** Array of hex color codes in the palette */
  colors: string[];
  /** ISO timestamp of when the palette was created */
  createdAt: string;
};
