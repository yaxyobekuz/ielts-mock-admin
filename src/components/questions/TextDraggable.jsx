import RichTextPreviewer from "../RichTextPreviewer";

const TextDraggable = ({ text, initialNumber, options }) => {
  return (
    <div className="flex gap-5 w-full">
      <RichTextPreviewer
        text={text}
        allowDropzone
        initialNumber={initialNumber}
      />

      <div className="min-w-max space-y-2 pr-5">
        <b className="inline-block">{options.title}</b>

        {/* Answer options */}
        <ul className="max-w-max rounded-md space-y-2">
          {options.data.map(({ option }, index) => {
            return (
              <li
                key={index}
                className="max-w-max bg-white cursor-move px-2 rounded border border-gray-400"
              >
                {option}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TextDraggable;
