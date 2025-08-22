import RichTextPreviewer from "../RichTextPreviewer";

const Text = ({ text, initialNumber, allowImage = false }) => {
  return (
    <RichTextPreviewer
      allowImage
      allowInput
      text={text}
      initialNumber={initialNumber}
    />
  );
};

export default Text;
