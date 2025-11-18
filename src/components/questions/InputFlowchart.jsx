// Components
import Icon from "../Icon";
import RichTextPreviewer from "../RichTextPreviewer";

// Helpers
import { countExactMatches } from "../../lib/helpers";

// Icons
import arrowDownIcon from "../../assets/icons/arrow-down.svg";

const target = '<span data-name="dropzone"></span>';

const InputFlowchart = ({ items, initialNumber }) => {
  return (
    <div className="space-y-2 max-w-max">
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
                allowInput
                allowCoords={false}
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
  );
};

export default InputFlowchart;
