// Helpers
import { convertToHtml } from "../../lib/helpers";

const TextDraggable = ({ text, initialNumber, answerChoices }) => {
  // Content
  return (
    <div className="flex gap-5 w-full">
      <pre
        className="flex-1 overflow-auto max-w-max"
        dangerouslySetInnerHTML={{ __html: convertToHtml(text, initialNumber) }}
      />

      <div>
        <b className="inline-block mb-2">{answerChoices.title}</b>

        {/* Answer options */}
        <ul className="max-w-max rounded-md space-y-2">
          {answerChoices.options.map((item, index) => {
            return (
              <li
                key={index}
                className="max-w-max bg-white cursor-move px-2 rounded border border-gray-400"
              >
                {item.option}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TextDraggable;
