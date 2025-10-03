const GridMatching = ({ initialNumber, grid }) => {
  const getColumnLabel = (index) => String.fromCharCode(65 + index);

  return (
    <div className="py-5">
      {/* Head */}
      <div className="flex h-12 transition-colors duration-200 hover:bg-gray-50">
        <div className="btn w-full h-12 p-0 rounded-none border-r border-black font-bold" />
        {Array.from({ length: grid.answerColumns }, (_, i) => (
          <div
            key={i}
            className="shrink-0 btn size-12 p-0 rounded-none border-r border-black font-bold last:border-r-0"
          >
            {getColumnLabel(i)}
          </div>
        ))}
      </div>

      {/* Body */}
      {grid.questions.map((question, qIndex) => (
        <div
          key={qIndex}
          className="flex min-h-12 border-t border-black transition-colors duration-200 hover:bg-gray-50"
        >
          {/* Question */}
          <div className="flex items-start gap-3 w-full h-auto p-1.5 rounded-none border-r border-black focus-within:bg-gray-100">
            <b>{qIndex + initialNumber}</b>
            <p>{question.text}</p>
          </div>

          {/* Answers */}
          {Array.from({ length: grid.answerColumns }, (_, aIndex) => (
            <label
              key={aIndex}
              className="shrink-0 btn w-12 h-auto p-0 rounded-none border-r border-black last:border-r-0"
            >
              <input type="radio" name={`question-${qIndex}`} />
            </label>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GridMatching;
