// Helpers
import { isNumber } from "@/lib/helpers";

// Icons
import { Check, Trash } from "lucide-react";

// Toast
import { toast } from "@/notification/toast";

// Api
import { sectionsApi } from "@/api/sections.api";

// Components
import Input from "@/components/form/Input";
import Button from "@/components/form/Button";
import EditorHeader from "@/components/EditorHeader";

// Hooks
import useModule from "@/hooks/useModule";
import useDebouncedState from "@/hooks/useDebouncedState";

// Router
import { useNavigate, useParams } from "react-router-dom";

// React
import { useState, useCallback, useEffect, useMemo } from "react";

const RadioGroupEditor = () => {
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
  const isInvalidSectionType = !(section?.type === "radio-group");
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
  const [groups, setGroups, flashUpdateGroups] = useDebouncedState(
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

  const hanldeAIContentChange = (content) => {
    setEditorKey((prev) => prev + 1);
    flashUpdateGroups(
      (content?.data || []).map((i) => ({ correctAnswerIndex: 0, ...i }))
    );
  };

  return (
    <div className="editor-page">
      {/* Header */}
      <EditorHeader
        allowAIEdit
        isSaving={isSaving}
        isUpdating={isUpdating}
        title="Variantlar guruhi"
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
        <Groups key={editorKey} initialGroups={groups} onChange={setGroups} />
      </div>
    </div>
  );
};

const initialGroupItem = {
  question: "",
  correctAnswerIndex: 0,
  answers: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
};

const Groups = ({ onChange, initialGroups = [] }) => {
  const [groups, setGroups] = useState(initialGroups);
  const initialMaxAnswersCount = useMemo(() => {
    return groups ? groups[0]?.answers?.length || 4 : 4;
  }, [initialGroups]);

  // Add new group
  const handleAddGroup = useCallback(() => {
    setGroups((prev) => [...prev, { ...initialGroupItem }]);
  }, []);

  // Copy last group
  const handleCopyLastGroup = useCallback(() => {
    setGroups((prev) => {
      if (prev.length === 0) return prev;

      const lastGroup = prev[prev.length - 1];
      const copiedGroup = {
        ...lastGroup,
        question: "",
        answers: lastGroup.answers.map((a) => ({ ...a })),
        correctAnswerIndex: lastGroup.correctAnswerIndex || 0,
      };

      return [...prev, copiedGroup];
    });
  }, []);

  // Update max answers count
  const handleMaxAnswersChange = useCallback((e) => {
    const newCount = parseInt(e.target.value, 10);

    setGroups((prev) =>
      prev.map((group) => {
        let updatedAnswers = [...group.answers];

        // agar javoblar soni kam bo'lsa -> yangi bo'sh javob qo'shish
        if (updatedAnswers.length < newCount) {
          const diff = newCount - updatedAnswers.length;
          for (let i = 0; i < diff; i++) {
            updatedAnswers.push({ text: "" });
          }
        }

        // agar javoblar soni ortiqcha bo'lsa -> qisqartirish
        if (updatedAnswers.length > newCount) {
          updatedAnswers = updatedAnswers.slice(0, newCount);
        }

        // correctAnswerIndex doim mavjud bo'lishi shart
        let newCorrectIndex = group.correctAnswerIndex;
        if (newCorrectIndex >= newCount) {
          newCorrectIndex = 0; // default bo'lib birinchi javobga o'tadi
        }

        return {
          ...group,
          answers: updatedAnswers,
          correctAnswerIndex: newCorrectIndex,
        };
      })
    );
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
      {/* Select max answers count */}
      <div className="flex gap-3.5">
        {/* Label */}
        <label
          htmlFor="max-answers-count"
          className="btn bg-gray-100 border-2 text-base cursor-pointer hover:bg-gray-50"
        >
          Javoblar soni
        </label>

        {/* Select */}
        <select
          id="max-answers-count"
          name="max-answers-count"
          onChange={handleMaxAnswersChange}
          defaultValue={initialMaxAnswersCount}
          className="btn max-w-max bg-gray-100 border-2"
        >
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
          <option>8</option>
          <option>9</option>
          <option>10</option>
        </select>
      </div>

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
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                className="w-full h-14 resize-none rounded-md px-2.5 py-1 scroll-y-primary"
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
      <div className="flex items-center justify-center gap-5 w-full">
        <Button onClick={handleAddGroup}>Variantlar qo'shish</Button>

        {/* Copy last group */}
        <Button variant="lightBlue" onClick={handleCopyLastGroup} className="">
          Oxirgi variantdan nusxa olish
        </Button>
      </div>
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
      <li key={index} className="flex items-center gap-3">
        {/* Correct answer selector */}
        <label className="cursor-pointer">
          <input
            type="radio"
            className="hidden peer"
            name={`radio-${groupNumber}`}
            checked={correctAnswerIndex === index}
            onChange={() => onCorrectChange(index)}
          />

          <div className="group btn p-0 size-8 bg-gray-200 rounded-full peer-checked:bg-green-500">
            <Check size={18} color="white" className="mt-px" />
          </div>
        </label>

        {/* Answer text */}
        <Input
          value={text}
          className="w-full"
          placeholder={`Answer ${index + 1}`}
          onChange={(value) => onAnswerChange(index, value)}
        />
      </li>
    ))}
  </ul>
);

const ErrorContent = () => <i>Hmmm... Nimadir noto'g'ri ketdi!</i>;

export default RadioGroupEditor;
