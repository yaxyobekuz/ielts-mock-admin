export const convertToHtml = (
  text,
  initialNumber = 1,
  disableDropZone = false,
  disableInput = false
) => {
  let inputCounter = initialNumber;

  return (
    text

      // Convert bold
      .replace(/\*(.*?)\*/g, "<b>$1</b>")

      // Convert italic
      .replace(/_(.*?)_/g, "<i>$1</i>")

      // Convert underline
      .replace(/\|(.*?)\|/g, "<u>$1</u>")

      // Convert special input with counter
      .replace(/\^(?!\w)/g, () => {
        if (disableInput) return "^";
        const currentNumber = inputCounter++;
        return `<input type="text" class="question-input" placeholder="${currentNumber}">`;
      })

      // Convert special draggable input with counter
      .replace(/\~(?!\w)/g, () => {
        if (disableDropZone) return "~";
        const currentNumber = inputCounter++;
        return `<span class="answer-dropzone" data-number="${currentNumber}">${currentNumber}</span>`;
      })

      // Convert list items
      .replace(/^- (.*$)/gim, "<li>$1</li>")

      // Wrap consecutive list items in <ul>
      .replace(/(<li>.*<\/li>)/gs, (match) => {
        return `<ul class="list-disc list-inside -space-y-5">${match}</ul>`;
      })
  );
};

// Check if string is a valid number
export const isStringNumber = (string) => {
  // Check if input is string
  if (typeof string !== "string") return false;

  // Check if string is empty or only whitespace
  if (string.trim() === "") return false;

  // Use Number() and isNaN() to check validity
  return !isNaN(Number(string));
};

export const countSpecificCharacter = (text, char) => {
  return text.split(char).length - 1;
};
