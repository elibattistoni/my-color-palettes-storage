import { Action, ActionPanel } from "@raycast/api";

interface ColorPaletteActionsProps {
  handleSubmit: (values: any) => boolean | void | Promise<boolean | void>;
  addColor: () => void;
  removeColor: (colorId: number) => void;
  pickColor: () => Promise<void>;
  clearForm: () => void;
  colors: { id: number; color: string }[];
}

export function ColorPaletteActions({
  handleSubmit,
  addColor,
  removeColor,
  pickColor,
  clearForm,
  colors,
}: ColorPaletteActionsProps) {
  return (
    <ActionPanel>
      <Action.SubmitForm onSubmit={handleSubmit} />
      <Action title="Add Color" onAction={addColor} shortcut={{ modifiers: ["cmd"], key: "n" }} />
      {colors.length > 1 && (
        <Action
          title="Remove Last Color"
          onAction={() => removeColor(colors[colors.length - 1].id)}
          shortcut={{ modifiers: ["cmd"], key: "backspace" }}
        />
      )}
      <Action title="Pick Color" shortcut={{ modifiers: ["cmd", "shift"], key: "p" }} onAction={pickColor} />
      <Action title="Clear Form" onAction={clearForm} shortcut={{ modifiers: ["cmd", "shift"], key: "r" }} />
    </ActionPanel>
  );
}
