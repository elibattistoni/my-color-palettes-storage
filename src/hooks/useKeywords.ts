import { useLocalStorage } from "@raycast/utils";
import { ColorPaletteFormFields } from "../types";

export function useKeywords(draftValues?: ColorPaletteFormFields) {
  const { value: keywords, setValue: setKeywords } = useLocalStorage<string[]>(
    "color-palettes-keywords",
    draftValues?.keywords || [],
  );

  const updateKeywords = async (keywordsText: string, setFormValues: any) => {
    const inputKeywords = keywordsText
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    let newKeywords = [...(keywords ?? [])];

    const newlyAddedKeywords = inputKeywords.filter((keyword) => !keyword.startsWith("!"));

    inputKeywords.forEach((keyword) => {
      if (keyword.startsWith("!")) {
        // Remove keyword - extract the keyword name without the '!' prefix
        const tagToRemove = keyword.slice(1);
        newKeywords = newKeywords.filter((existingTag) => existingTag !== tagToRemove);
      } else {
        // Add keyword if it doesn't already exist
        if (!newKeywords.includes(keyword)) {
          newKeywords.push(keyword);
        }
      }
    });

    await setKeywords(newKeywords);
    setFormValues("keywords", (prev: string[]) => [...prev, ...newlyAddedKeywords]);
  };

  return {
    keywords,
    setKeywords,
    updateKeywords,
  };
}
