export type ColorPaletteFormFields = {
  name: string;
  description: string;
  mode: string;
  keywords: string[];
  [key: `color${number}`]: string;
};

export type SavedPalette = {
  id: string;
  name: string;
  description: string;
  mode: "light" | "dark";
  keywords: string[];
  colors: string[];
  createdAt: string;
};
