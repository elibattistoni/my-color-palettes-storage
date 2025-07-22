import { Form } from "@raycast/api";
import { PaletteFormFields } from "../types";

interface ColorFieldsSectionProps {
  colors: { id: number; color: string }[];
  itemProps: any;
  getFocusField: () => string | undefined;
}

export function ColorFieldsSection({ colors, itemProps, getFocusField }: ColorFieldsSectionProps) {
  return (
    <>
      <Form.Separator />
      {colors.map((color, index) => {
        const colorKey = `color${index + 1}` as keyof PaletteFormFields;
        const shouldFocus = getFocusField() === colorKey;
        return (
          <Form.TextField
            key={color.id}
            {...(itemProps[colorKey] as any)}
            title={`${index + 1}. Color${index === 0 ? "*" : ""}`}
            placeholder="e.g., #FF5733, rgb(255, 87, 51), or rgba(255, 87, 51, 0.8)"
            autoFocus={shouldFocus}
          />
        );
      })}
    </>
  );
}
