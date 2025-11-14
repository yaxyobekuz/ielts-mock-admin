// Helpers
import { isNumber } from "@/lib/helpers";

// Toast
import { toast } from "@/notification/toast";

// Api
import { sectionsApi } from "@/api/sections.api";

// Icons
import { Check, Plus, Minus } from "lucide-react";

// Components
import EditorHeader from "@/components/EditorHeader";

// React
import { useState, useCallback, useEffect } from "react";

// Hooks
import useModule from "@/hooks/useModule";
import useDebouncedState from "@/hooks/useDebouncedState";

// Router
import { useNavigate, useParams } from "react-router-dom";

const GridMatchingEditor = () => {
  // State & Hooks
  const modules = ["listening", "reading", "writing"];
  const { testId, partNumber, module, sectionIndex } = useParams();
  const { getModuleData, updateSection } = useModule(module, testId);
  const { parts } = getModuleData() || {};

  // Data
  const part = parts?.find((p) => p.number === parseInt(partNumber));
  const section = part?.sections[sectionIndex];

  // Validators
  const isInvalidModule = !modules.includes(module);
  const isInvalidSectionType = !(section?.type === "grid-matching");
  const isInvalidData = !isNumber(partNumber) || !isNumber(sectionIndex);

  // Check if data is invalid
  if (isInvalidData || isInvalidSectionType || isInvalidModule) {
    return <ErrorContent />;
  }

  // State
  const navigate = useNavigate();
  const [editorKey, setEditorKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [grid, setGrid, flashUpdateGrid] = useDebouncedState(
    section?.grid,
    setIsSaving
  );
  const [description, setDescription] = useDebouncedState(
    section?.description || "",
    setIsSaving
  );

  // Original
  const [original, setOriginal] = useState({
    grid: JSON.stringify(grid),
    description: section?.description || "",
  });

  // Check if content has changed
  const hasContentChanged =
    description !== original.description ||
    JSON.stringify(grid) !== original.grid;

  const handleNavigate = () => {
    const path = `/tests/${testId}/preview/${module}/${partNumber}#s-${sectionIndex}`;
    navigate(path);
  };

  console.log(grid);

  // Update section data from store
  const handleSaveContent = () => {
    if (isUpdating) return;
    setIsUpdating(true);

    const sectionData = { grid, description };

    sectionsApi
      .update(section._id, sectionData)
      .then(({ code, section }) => {
        if (code !== "sectionUpdated") throw new Error();
        handleNavigate();
        setIsSaving(false);
        updateSection(partNumber, section, sectionIndex);
        setOriginal({ grid: JSON.stringify(grid), description });
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => setIsUpdating(false));
  };

  const hanldeAIContentChange = (content) => {
    const data = content?.data || {};
    const dataQuestions = data.questions.map((q) => ({
      correctAnswerIndex: 0,
      ...q,
    }));

    setEditorKey((prev) => prev + 1);
    flashUpdateGrid({ ...data, questions: dataQuestions });
  };

  return (
    <div className="editor-page">
      {/* Header */}
      <EditorHeader
        allowAIEdit
        isSaving={isSaving}
        isUpdating={isUpdating}
        title="Kataklar tanlash"
        handleNavigate={handleNavigate}
        initialDescription={description}
        originalContent={original.content}
        onDescriptionChange={setDescription}
        hasContentChanged={hasContentChanged}
        handleSaveContent={handleSaveContent}
        onContentChange={hanldeAIContentChange}
      />

      {/* Editor */}
      <div className="container space-y-5">
        <GridEditor key={editorKey} initialGridData={grid} onChange={setGrid} />
      </div>
    </div>
  );
};

const GridEditor = ({
  onChange,
  initialGridData = { questions: [], answerColumns: 2 },
}) => {
  const minAnswers = 2;
  const maxAnswers = 12;
  const minQuestions = 1;
  const maxQuestions = 24;
  const [gridData, setGridData] = useState(() => {
    if (initialGridData.questions?.length > 0) {
      return initialGridData;
    }

    return {
      answerColumns: 2,
      questions: [{ text: "", correctAnswerIndex: 0 }],
    };
  });

  // Generate column labels (A, B, C, ...)
  const getColumnLabel = (index) => String.fromCharCode(65 + index);

  // Add new question row
  const handleAddQuestion = useCallback(() => {
    if (gridData.questions.length >= maxQuestions) return;

    setGridData((prev) => ({
      ...prev,
      questions: [...prev.questions, { text: "", correctAnswerIndex: 0 }],
    }));
  }, [gridData.questions.length]);

  // Remove last question row
  const handleRemoveQuestion = useCallback(() => {
    if (gridData.questions.length <= minQuestions) return;

    setGridData((prev) => ({
      ...prev,
      questions: prev.questions.slice(0, -1),
    }));
  }, [gridData.questions.length]);

  // Add answer column
  const handleAddAnswerColumn = useCallback(() => {
    if (gridData.answerColumns >= maxAnswers) return;

    setGridData((prev) => ({
      ...prev,
      answerColumns: prev.answerColumns + 1,
    }));
  }, [gridData.answerColumns]);

  // Remove last answer column
  const handleRemoveAnswerColumn = useCallback(() => {
    if (gridData.answerColumns <= minAnswers) return;

    setGridData((prev) => ({
      ...prev,
      answerColumns: prev.answerColumns - 1,
      questions: prev.questions.map((q) => ({
        ...q,
        correctAnswerIndex:
          q.correctAnswerIndex >= prev.answerColumns - 1
            ? 0
            : q.correctAnswerIndex,
      })),
    }));
  }, [gridData.answerColumns]);

  // Update question text
  const handleQuestionChange = useCallback((index, value) => {
    setGridData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, text: value } : q
      ),
    }));
  }, []);

  // Update correct answer
  const handleCorrectAnswerChange = useCallback(
    (questionIndex, answerIndex) => {
      setGridData((prev) => ({
        ...prev,
        questions: prev.questions.map((q, i) =>
          i === questionIndex ? { ...q, correctAnswerIndex: answerIndex } : q
        ),
      }));
    },
    []
  );

  // Emit changes to parent
  useEffect(() => {
    onChange?.(gridData);
  }, [gridData]);

  return (
    <div className="space-y-5 py-5">
      {/* Controls */}
      <div className="flex items-center gap-5">
        {/* Question controls */}
        <div className="flex items-center gap-3.5 border px-8 py-5">
          {/* Label */}
          <b>Savollar:</b>

          {/* Remove question */}
          <ControlButton
            isDanger
            onClick={handleRemoveQuestion}
            title="Oxirgi savolni o'chirish"
            disabled={gridData.questions.length <= minQuestions}
          />

          {/* Count */}
          <span className="text-sm min-w-6 text-center">
            {gridData.questions.length}
          </span>

          {/* Add question */}
          <ControlButton
            title="Savol qo'shish"
            onClick={handleAddQuestion}
            disabled={gridData.questions.length >= maxQuestions}
          />
        </div>

        {/* Answer controls */}
        <div className="flex items-center gap-3.5 border px-8 py-5">
          {/* Label */}
          <b>Javoblar:</b>

          {/* Remove answer */}
          <ControlButton
            isDanger
            title="Oxirgi ustunni o'chirish"
            onClick={handleRemoveAnswerColumn}
            disabled={gridData.answerColumns <= minAnswers}
          />

          {/* Count */}
          <span className="text-sm min-w-6 text-center">
            {gridData.answerColumns}
          </span>

          {/* Add answer */}
          <ControlButton
            title="Ustun qo'shish"
            onClick={handleAddAnswerColumn}
            disabled={gridData.answerColumns >= maxAnswers}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="border p-8">
        {/* Head */}
        <div className="flex h-12 transition-colors duration-200 hover:bg-gray-50">
          {/* TR */}
          <div className="btn size-12 p-0 rounded-none border-r border-black font-bold">
            T/R
          </div>

          {/* Answers col */}
          <div className="btn w-96 h-12 p-0 rounded-none border-r border-black font-bold">
            Javoblar
          </div>

          {/* Col labels */}
          {Array.from({ length: gridData.answerColumns }, (_, i) => (
            <div
              key={i}
              className="btn size-12 p-0 rounded-none border-r border-black font-bold last:border-r-0"
            >
              {getColumnLabel(i)}
            </div>
          ))}
        </div>

        {/* Body */}
        {gridData.questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="flex h-20 border-t border-black transition-colors duration-200 hover:bg-gray-50"
          >
            {/* TR */}
            <div className="btn w-12 size-full p-0 rounded-none border-r border-black font-bold">
              {qIndex + 1}
            </div>

            {/* Question */}
            <div className="w-96 h-full p-0 rounded-none border-r border-black focus-within:bg-gray-100">
              <textarea
                type="text"
                value={question.text}
                id={`grid-answer-${qIndex + 1}`}
                placeholder={`Savol ${qIndex + 1}`}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                className="size-full bg-transparent py-0.5 rounded-none outline-none resize-none scroll-y-primary"
              />
            </div>

            {/* Answers */}
            {Array.from({ length: gridData.answerColumns }, (_, aIndex) => (
              <label
                key={aIndex}
                className="btn w-12 h-full p-0 rounded-none border-r border-black cursor-pointer last:border-r-0"
              >
                <input
                  type="radio"
                  className="hidden peer"
                  name={`question-${qIndex}`}
                  checked={question.correctAnswerIndex === aIndex}
                  onChange={() => handleCorrectAnswerChange(qIndex, aIndex)}
                />

                <div className="group btn p-0 size-6 bg-gray-200 rounded-full peer-checked:bg-green-500">
                  <Check size={16} color="white" className="mt-px" />
                </div>
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const ControlButton = ({ onClick, disabled, isDanger = false, title = "" }) => (
  <button
    title={title}
    onClick={onClick}
    aria-label={title}
    disabled={disabled}
    className="group btn size-10 p-0 rounded-none disabled:opacity-50"
  >
    <div
      className={`${
        isDanger
          ? "bg-red-500 group-hover:bg-red-600 group-disabled:bg-red-500"
          : "bg-blue-500 group-hover:bg-blue-600 group-disabled:bg-blue-500"
      } btn size-6 p-0 rounded-full text-white`}
    >
      {isDanger ? <Minus size={18} /> : <Plus size={18} />}
    </div>
  </button>
);

const ErrorContent = () => <i>Hmmm... Nimadir noto'g'ri ketdi!</i>;

export default GridMatchingEditor;
