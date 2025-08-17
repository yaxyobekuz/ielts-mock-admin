const RadioGroup = ({ initialNumber, groups }) => {
  return (
    <ul className="space-y-6">
      {groups.map(({ text, answers }, index) => {
        const groupNumber = initialNumber + index;
        return (
          <li key={index}>
            <p className="mb-1">
              <b className="inline-block py-0.5 px-1.5 rounded mr-2 border-2 transition-colors duration-300">
                {groupNumber}
              </b>
              <span>{text}</span>
            </p>

            {/* Answers */}
            <Answers groupNumber={groupNumber} answers={answers} />
          </li>
        );
      })}
    </ul>
  );
};

const Answers = ({ answers, groupNumber }) => (
  <ul>
    {answers.map(({ text }, index) => (
      <li key={index}>
        <label className="flex items-center gap-3.5 h-11 px-3.5 rounded-md cursor-pointer hover:bg-gray-100">
          <input type="radio" value={text} name={`answer-${groupNumber}`} />
          <span>{text}</span>
        </label>
      </li>
    ))}
  </ul>
);

export default RadioGroup;
