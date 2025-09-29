import { useMemo, useState } from "react";

const CheckboxGroup = ({ initialNumber, groups }) => {
  const groupNumbers = useMemo(() => {
    let current = initialNumber;
    return groups.map(({ maxSelected }) => {
      const start = current;
      const end = current + maxSelected - 1;
      current = end + 1;
      return { start, end };
    });
  }, [groups, initialNumber]);

  return (
    <ul className="space-y-6">
      {groups.map(({ question, answers, maxSelected }, index) => {
        const { start, end } = groupNumbers[index];
        return (
          <li key={index}>
            <p className="mb-1">
              <b className="inline-block py-0.5 px-1.5 rounded mr-2 border-2 transition-colors duration-300">
                {start} - {end}
              </b>

              <span>{question}</span>
            </p>

            {/* Answers */}
            <Answers
              answers={answers}
              groupNumber={start}
              maxSelected={maxSelected}
            />
          </li>
        );
      })}
    </ul>
  );
};

const Answers = ({ answers, groupNumber, maxSelected }) => {
  const [selectedCount, setSelectedCount] = useState(0);

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setSelectedCount((prev) => prev + 1);
    } else {
      setSelectedCount((prev) => prev - 1);
    }
  };

  return (
    <ul>
      {answers.map(({ text }, index) => {
        const checkboxId = `answer-${groupNumber}-${index}`;

        return (
          <li key={index}>
            <label
              htmlFor={checkboxId}
              className="flex items-center gap-3.5 h-11 px-3.5 rounded-md cursor-pointer hover:bg-gray-100"
            >
              <input
                value={text}
                type="checkbox"
                id={checkboxId}
                name={`group-${groupNumber}`}
                onChange={handleCheckboxChange}
                className="w-auto cursor-pointer disabled:opacity-50"
                disabled={
                  selectedCount >= maxSelected &&
                  !document.getElementById(checkboxId)?.checked
                }
              />

              <span>{text}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
};

export default CheckboxGroup;
