// Components
import Icon from "../Icon";
import RichTextPreviewer from "../RichTextPreviewer";

// Helpers
import { countExactMatches } from "../../lib/helpers";

// Icons
import arrowDownIcon from "../../assets/icons/arrow-down.svg";

const target = '<span data-name="dropzone"></span>';

const Flowchart = ({ items, initialNumber, options }) => {
  return (
    <div className="flex gap-5 w-full">
      <div className="space-y-2">
        {/* Title */}
        <b className="block text-center">{items.title}</b>

        {/* Blocks */}
        <div className="space-y-2">
          {items.data.map(({ text }, index) => {
            const prevContents = items.data
              .slice(0, index)
              .map((item) => item.text)
              .join("");

            const itemInitialNumber =
              countExactMatches(prevContents, target) + initialNumber;

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2 relative z-0"
              >
                <RichTextPreviewer
                  text={text}
                  allowDropzone
                  initialNumber={itemInitialNumber}
                  className="w-full p-2 text-editor border-2 border-[#333]"
                />

                {/* Arrow icon */}
                {items.data.length !== index + 1 ? (
                  <Icon src={arrowDownIcon} alt="Arrow down" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer choices wrapper */}
      <div>
        <b className="inline-block mb-2">{options.title}</b>

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

export default Flowchart;
