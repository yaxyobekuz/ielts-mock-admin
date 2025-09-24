import RichTextPreviewer from "../RichTextPreviewer";

const Text = ({ text, initialNumber, coords }) => {
  return (
    <RichTextPreviewer
      allowImage
      allowInput
      text={text}
      coords={coords}
      initialNumber={initialNumber}
    />
  );
};

export default Text;
