
// Icons
import { Trash } from "lucide-react";

// Helpers
import { isNumber } from "../../lib/helpers";

// Toast
import { toast } from "@/notification/toast";

// Api
import { sectionsApi } from "@/api/sections.api";

// Components
import EditorHeader from "../../components/EditorHeader";

// Router
import { useNavigate, useParams } from "react-router-dom";

// React
import { useState, useCallback, useEffect } from "react";

// Hooks
import useModule from "../../hooks/useModule";
import useDebouncedState from "../../hooks/useDebouncedState";

const RadioGroupEditor = () => {
  // State & Hooks
  const modules = ["listening", "reading", "writing"];
  const { testId, partNumber, module, sectionIndex } = useParams();
  const { getModuleData, updateSection } = useModule(module, testId);
  const parts = getModuleData();

  // Data
  const part = parts?.find((p) => p.number === parseInt(partNumber));
  const section = part?.sections[sectionIndex];

  // Validators
  const isInvalidModule = !modules.includes(module);
  const isInvalidSectionType = !(section?.type === "radio-group");
  const isInvalidData = !isNumber(partNumber) || !isNumber(sectionIndex);

  // Check if data is invalid
  if (isInvalidData || isInvalidSectionType || isInvalidModule) {
    return <ErrorContent />;
  }

  // State
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [groups, setGroups] = useDebouncedState(
    section?.groups || [],
    setIsSaving
  );
  const [description, setDescription] = useDebouncedState(
    section?.description || "",
    setIsSaving
  );

  // Original
  const [original, setOriginal] = useState({
    groups: JSON.stringify(groups) || [],
    description: section?.description || "",
  });

  // Check if content has changed
  const hasContentChanged =
    description !== original.description ||
    JSON.stringify(groups) !== JSON.stringify(original.groups);

  const handleNavigate = () => {
    const path = `/tests/${testId}/preview/${module}/${partNumber}#s-${sectionIndex}`;
    navigate(path);
  };

  // Update section data from store
  const handleSaveContent = () => {
    if (isUpdating) return;
    setIsUpdating(true);

    const sectionData = { groups, description };

    sectionsApi
      .update(section._id, sectionData)
      .then(({ code, section }) => {
        if (code !== "sectionUpdated") throw new Error();
        handleNavigate();
        setIsSaving(false);
        setOriginal({ groups, description });
        updateSection(partNumber, section, sectionIndex);
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => setIsUpdating(false));
  };

  return (
    <div className="editor-page">
      {/* Header */}
      <EditorHeader
        isSaving={isSaving}
        isUpdating={isUpdating}
        title="Variantlar guruhi"
        handleNavigate={handleNavigate}
        initialDescription={description}
        originalContent={original.content}
        onDescriptionChange={setDescription}
        hasContentChanged={hasContentChanged}
        handleSaveContent={handleSaveContent}
      />

      {/* Editor */}
      <div className="container space-y-5">
        <Groups initialGroups={groups} onChange={setGroups} />
      </div>
    </div>
  );
};

const initialGroupItem = {
  question: "Question text",
  answers: [
    { text: "Answer 1" },
    { text: "Answer 2" },
    { text: "Answer 3" },
    { text: "Answer 4" },
  ],
  correctAnswerIndex: 0,
};

const Groups = ({ onChange, initialGroups = [] }) => {
  const [groups, setGroups] = useState(initialGroups);

  // Add new group
  const handleAddGroup = useCallback(() => {
    setGroups((prev) => [...prev, { ...initialGroupItem }]);
  }, []);

  // Delete group
  const handleDeleteGroup = useCallback((index) => {
    setGroups((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Update question text
  const handleQuestionChange = (groupIndex, value) => {
    setGroups((prev) =>
      prev.map((group, i) =>
        i === groupIndex ? { ...group, question: value } : group
      )
    );
  };

  // Update answer text
  const handleAnswerChange = (groupIndex, answerIndex, value) => {
    setGroups((prev) =>
      prev.map((group, i) => {
        if (i === groupIndex) {
          return {
            ...group,
            answers: group.answers.map((ans, j) =>
              j === answerIndex ? { ...ans, text: value } : ans
            ),
          };
        }

        return group;
      })
    );
  };

  // Update correct answer
  const handleCorrectAnswerChange = (groupIndex, answerIndex) => {
    setGroups((prev) =>
      prev.map((group, i) =>
        i === groupIndex ? { ...group, correctAnswerIndex: answerIndex } : group
      )
    );
  };

  // Emit changes to parent
  useEffect(() => {
    onChange?.(groups);
  }, [groups]);

  return (
    <div className="space-y-5 py-5">
      {/* Groups list */}
      <ul className="mb-3 space-y-5">
        {groups.map(({ question, answers, correctAnswerIndex }, index) => (
          <li key={index} className="bg-gray-100 p-5 rounded-xl">
            {/* Group header */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">Group {index + 1}</h3>
                <button
                  onClick={() => handleDeleteGroup(index)}
                  className="flex items-center justify-center size-5"
                >
                  <Trash size={16} color="red" />
                </button>
              </div>

              <textarea
                value={question}
                placeholder="Group question"
                className="w-full h-14 resize-none rounded-md px-2.5 py-1"
                onChange={(e) => handleQuestionChange(index, e.target.value)}
              />
            </div>

            {/* Answers list */}
            <Answers
              answers={answers}
              groupNumber={index + 1}
              correctAnswerIndex={correctAnswerIndex}
              onAnswerChange={(answerIndex, value) =>
                handleAnswerChange(index, answerIndex, value)
              }
              onCorrectChange={(answerIndex) =>
                handleCorrectAnswerChange(index, answerIndex)
              }
            />
          </li>
        ))}
      </ul>

      {/* Add new group */}
      <button
        onClick={handleAddGroup}
        className="flex items-center justify-center w-48 h-9 bg-blue-100 mx-auto text-blue-500 rounded-md"
      >
        Add Group +
      </button>
    </div>
  );
};

const Answers = ({
  answers,
  groupNumber,
  onAnswerChange,
  onCorrectChange,
  correctAnswerIndex,
}) => (
  <ul className="space-y-3.5">
    {answers.map(({ text }, index) => (
      <li key={index} className="flex gap-3 items-start">
        {/* Correct answer selector */}
        <input
          type="radio"
          className="size-4"
          name={`radio-${groupNumber}`}
          checked={correctAnswerIndex === index}
          onChange={() => onCorrectChange(index)}
        />

        {/* Answer text */}
        <textarea
          value={text}
          placeholder={`Answer ${index + 1}`}
          onChange={(e) => onAnswerChange(index, e.target.value)}
          className="w-full h-14 resize-none rounded-md px-2.5 py-1"
        />
      </li>
    ))}
  </ul>
);

const ErrorContent = () => <i>Hmmm... Nimadir noto'g'ri ketdi!</i>;

export default RadioGroupEditor;
