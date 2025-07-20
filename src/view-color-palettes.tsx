import { Action, ActionPanel, Detail, Icon, LaunchType, List, showToast, Toast } from "@raycast/api";
import { useLocalStorage } from "@raycast/utils";
import { useEffect, useState } from "react";
import SaveColorPalettesCommand from "./save-color-palettes";
import { SavedPalette } from "./types";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function Command() {
  const {
    value: colorPalettes,
    setValue: setColorPalettes,
    isLoading,
  } = useLocalStorage<SavedPalette[]>("color-palettes-list", []);

  const [searchText, setSearchText] = useState("");
  const [filteredList, setFilteredList] = useState<SavedPalette[]>([]);

  useEffect(() => {
    if (colorPalettes && colorPalettes.length > 0) {
      const filtered = colorPalettes.filter((item) => {
        if (!searchText) return true;

        const searchLower = searchText.toLowerCase();
        return (
          (item.keywords && item.keywords.some((keyword) => keyword.toLowerCase().includes(searchLower))) ||
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        );
      });
      setFilteredList(filtered);
    } else {
      setFilteredList([]);
    }
  }, [searchText, colorPalettes]);

  useEffect(() => {}, [searchText]);

  const deletePalette = async (paletteId: string) => {
    try {
      const updatedPalettes = colorPalettes ? colorPalettes.filter((palette) => palette.id !== paletteId) : [];
      await setColorPalettes(updatedPalettes);

      showToast({
        style: Toast.Style.Success,
        title: "Deleted",
        message: "Color palette deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting palette:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Failed to delete color palette",
      });
    }
  };

  const createEditableFormData = (palette: SavedPalette, isDuplicate = false) => {
    const formData: any = {
      name: isDuplicate ? `${palette.name} (Copy)` : palette.name,
      description: palette.description,
      mode: palette.mode,
      keywords: palette.keywords || [],
    };

    // Add color fields
    palette.colors.forEach((color, index) => {
      formData[`color${index + 1}`] = color;
    });

    return formData;
  };

  const createPaletteMarkdown = (palette: SavedPalette) => {
    const colorSwatches = palette.colors
      .map(
        (color) =>
          `<div style="width: 50px; height: 50px; background-color: ${color}; display: inline-block; margin-right: 10px; border-radius: 4px;"></div>`,
      )
      .join("");

    const colorList = palette.colors.map((color, index) => `${index + 1}. \`${color}\``).join("\n");

    return `
# ${palette.name}

**Mode:** ${palette.mode === "dark" ? "Dark Color Palette" : "Light Color Palette"}

**Description:** ${palette.description}

**Keywords:** ${palette.keywords && palette.keywords.length > 0 ? palette.keywords.join(", ") : "No keywords"}

**Created:** ${formatDate(palette.createdAt)}

**Colors (${palette.colors.length}):**

${colorList}

---

### Color Palette
${colorSwatches}
    `;
  };

  return (
    <List
      isLoading={isLoading}
      filtering={false}
      onSearchTextChange={setSearchText}
      navigationTitle="Search Color Palettes"
      searchBarPlaceholder="Search your Color Palette..."
    >
      {filteredList.length === 0 ? (
        <List.EmptyView
          icon={Icon.Ellipsis}
          title="No Color Palettes Found"
          description="Create your first color palette using the save command"
        />
      ) : (
        filteredList.map((palette) => (
          <List.Item
            key={palette.id}
            icon={{
              source: palette.mode === "dark" ? Icon.Moon : Icon.Sun,
              tintColor: palette.mode === "dark" ? "#000000" : "#ffffff",
            }}
            title={palette.name}
            subtitle={palette.description}
            keywords={palette.keywords || []}
            accessories={[{ text: `${palette.colors.length} colors` }, { text: formatDate(palette.createdAt) }]}
            actions={
              <ActionPanel>
                <Action.Push
                  title="Show Palette Details"
                  target={<Detail markdown={createPaletteMarkdown(palette)} />}
                />
                <Action.Push
                  title="Edit Palette"
                  target={
                    <SaveColorPalettesCommand
                      launchType={LaunchType.UserInitiated}
                      arguments={{}}
                      draftValues={createEditableFormData(palette, false)}
                    />
                  }
                  icon={Icon.Pencil}
                  shortcut={{ modifiers: ["cmd"], key: "e" }}
                />
                <Action.Push
                  title="Duplicate Palette"
                  target={
                    <SaveColorPalettesCommand
                      launchType={LaunchType.UserInitiated}
                      arguments={{}}
                      draftValues={createEditableFormData(palette, true)}
                    />
                  }
                  icon={Icon.Duplicate}
                  shortcut={{ modifiers: ["cmd"], key: "d" }}
                />
                {/* <Action.CopyToClipboard title="Copy All Colors" content={palette.colors.join(", ")} />
                <Action.CopyToClipboard title="Copy First Color" content={palette.colors[0]} /> */}
                <Action
                  title="Delete Palette"
                  onAction={() => deletePalette(palette.id)}
                  style={Action.Style.Destructive}
                  shortcut={{ modifiers: ["cmd", "shift"], key: "d" }}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
