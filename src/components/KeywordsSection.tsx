import { Form, showToast, Toast } from "@raycast/api";
import { useState } from "react";

interface KeywordsSectionProps {
  keywords: string[] | undefined;
  itemProps: any;
  updateKeywords: (keywordsText: string) => Promise<void>;
}

export function KeywordsSection({ keywords, itemProps, updateKeywords }: KeywordsSectionProps) {
  const [updateKeywordsValue, setUpdateKeywordsValue] = useState("");

  return (
    <>
      <Form.TagPicker
        {...itemProps.keywords}
        title="Keywords"
        info="Pick one or more Keywords. Keywords will be used to search and filter Color Palettes. If the Keywords list is empty, add them through the Update Keywords field. To remove a keyword from the Keywords list, enter !keyword-to-remove in the Update Keywords field."
      >
        {keywords && keywords.map((keyword, idx) => <Form.TagPicker.Item key={idx} value={keyword} title={keyword} />)}
      </Form.TagPicker>
      <Form.TextField
        id="updateTags"
        title="Update Keywords"
        value={updateKeywordsValue}
        onChange={setUpdateKeywordsValue}
        placeholder="e.g., keyword1, keyword2, !keyword-to-remove"
        info="Enter Keywords separated by commas. Press Tab or move out of focus in order to add them to the Keywords List in the Keywords field above."
        onBlur={async (event) => {
          if (updateKeywordsValue) {
            await updateKeywords(updateKeywordsValue);
            showToast({
              style: Toast.Style.Success,
              title: "Keywords list successfully updated!",
              message: "",
            });
            setUpdateKeywordsValue("");
          }
        }}
      />
    </>
  );
}
