// Components
import Icon from "../Icon";

// Helpers
import { convertToHtml } from "../../lib/helpers";

// Icons
import arrowDownIcon from "../../assets/icons/arrow-down.svg";

const Flowchart = ({ flowchartItems, initialNumber, answerChoices }) => {
  return (
    <div className="flex gap-5 w-full">
      <div className="space-y-2">
        {/* Title */}
        <b className="block text-center">{flowchartItems.title}</b>

        {/* Blocks */}
        <div className="space-y-2">
          {flowchartItems.items.map(({ flowchartText }, index) => {
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2 relative"
              >
                <div
                  className="max-w-md w-full px-2 py-1 border-2 border-gray-500"
                  dangerouslySetInnerHTML={{
                    __html: convertToHtml(flowchartText, initialNumber + index),
                  }}
                />

                {/* Arrow icon */}
                {flowchartItems.items.length !== index + 1 ? (
                  <Icon src={arrowDownIcon} alt="Arrow down" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer choices wrapper */}
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

export default Flowchart;
