import { memo } from "react";

// Helpers
import { convertToHtml } from "../../lib/helpers";

const Text = memo(({ text, initialNumber }) => {
  if (!text) return null;

  return (
    <pre
      className="flex-1 overflow-auto max-w-none"
      dangerouslySetInnerHTML={{
        __html: convertToHtml(text, initialNumber, true),
      }}
    />
  );
});

Text.displayName = "Text";

export default Text;
