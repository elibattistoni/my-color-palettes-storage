/**
 * Keywords Section Component
 *
 * A comprehensive component for managing keyword tagging and organization within the palette form.
 * This component provides both selection from existing keywords and creation of new keywords,
 * with intelligent workflow management for optimal user experience.
 */

import { Form, showToast, Toast } from "@raycast/api";
import { useState } from "react";

/**
 * Props interface for the KeywordsSection component.
 */
interface KeywordsSectionProps {
  /** Array of available keywords from global storage */
  keywords: string[] | undefined;
  /** Form item properties from Raycast's useForm hook for validation and binding */
  itemProps: any;
  /** Function to update the global keywords list and form state */
  updateKeywords: (keywordsText: string) => Promise<void>;
}

/**
 * Renders an interactive keywords management section with creation and selection capabilities.
 *
 * This component provides a dual-interface approach to keyword management:
 * 1. A tag picker for selecting from existing keywords
 * 2. A text field for adding new keywords or removing existing ones
 *
 * The component handles the complex workflow of maintaining both global keyword storage
 * and individual palette keyword assignments, providing real-time feedback and seamless
 * integration between the two interfaces.
 *
 * **Features:**
 * - Visual tag picker for easy keyword selection
 * - Text input for adding multiple keywords at once
 * - Removal syntax using "!" prefix (e.g., "!red" removes "red")
 * - Real-time global keyword list updates
 * - User feedback through toast notifications
 * - Automatic form state synchronization
 * - Clear workflow guidance through info text
 *
 * **Workflow:**
 * 1. User can select existing keywords from tag picker
 * 2. User can add new keywords via text input (comma-separated)
 * 3. On blur, text input processes keywords and updates global list
 * 4. Form state automatically synchronized with new keywords
 * 5. User receives confirmation of successful updates
 *
 * @param props - Component properties
 * @param props.keywords - Available keywords for selection
 * @param props.itemProps - Form binding properties
 * @param props.updateKeywords - Function to process keyword updates
 *
 * @example
 * ```tsx
 * <KeywordsSection
 *   keywords={keywords}
 *   itemProps={itemProps}
 *   updateKeywords={handleUpdateKeywords}
 * />
 * ```
 */
export function KeywordsSection({ keywords, itemProps, updateKeywords }: KeywordsSectionProps) {
  /** Local state for the keyword input field value */
  const [updateKeywordsValue, setUpdateKeywordsValue] = useState("");

  /**
   * Handles the keyword update workflow when user finishes entering keywords.
   * Processes the input, updates global storage, provides feedback, and clears the input.
   */
  const handleKeywordUpdate = async () => {
    if (updateKeywordsValue.trim()) {
      await updateKeywords(updateKeywordsValue);
      showToast({
        style: Toast.Style.Success,
        title: "Keywords list successfully updated!",
        message: "",
      });
      setUpdateKeywordsValue("");
    }
  };

  return (
    <>
      {/* Tag picker for selecting from existing keywords */}
      <Form.TagPicker
        {...itemProps.keywords}
        title="Keywords"
        info="Pick one or more Keywords. Keywords will be used to search and filter Color Palettes. If the Keywords list is empty, add them through the Update Keywords field. To remove a keyword from the Keywords list, enter !keyword-to-remove in the Update Keywords field."
      >
        {keywords && keywords.map((keyword, idx) => <Form.TagPicker.Item key={idx} value={keyword} title={keyword} />)}
      </Form.TagPicker>

      {/* Text input for adding new keywords or removing existing ones */}
      <Form.TextField
        id="updateTags"
        title="Update Keywords"
        value={updateKeywordsValue}
        onChange={setUpdateKeywordsValue}
        placeholder="e.g., keyword1, keyword2, !keyword-to-remove"
        info="Enter Keywords separated by commas. Press Tab or move out of focus in order to add them to the Keywords List in the Keywords field above."
        onBlur={handleKeywordUpdate}
      />
    </>
  );
}
