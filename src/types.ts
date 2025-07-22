export type Color = {
  id: number;
  color: string;
};

export type PaletteFormFields = {
  name: string;
  description: string;
  mode: string;
  keywords: string[];
  [key: `color${number}`]: string;
};

export type StoredPalette = {
  id: string;
  name: string;
  description: string;
  mode: "light" | "dark";
  keywords: string[];
  colors: string[];
  createdAt: string;
};
