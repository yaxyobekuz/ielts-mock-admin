import { useNavigate, useParams } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";

// Icons
import { Trash } from "lucide-react";

// Components
import EditorHeader from "../../components/EditorHeader";
import RichTextEditor from "../../components/RichTextEditor";

// Hooks
import useModule from "../../hooks/useModule";
import useDebouncedState from "../../hooks/useDebouncedState";

// Helpers
import { isNumber, countExactMatches } from "../../lib/helpers";

const FlowchartEditor = () => {
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
  const isInvalidSectionType = !(section?.type === "flowchart");
  const isInvalidData = !isNumber(partNumber) || !isNumber(sectionIndex);

  // Check if data is invalid
  if (isInvalidData || isInvalidSectionType || isInvalidModule) {
    return <ErrorContent />;
  }

  // State
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [optionsTitle, setOptionsTitle] = useDebouncedState(
    section?.options?.title,
    setIsSaving
  );
  const [chartsTitle, setChartsTitle] = useDebouncedState(
    section?.items?.title,
    setIsSaving
  );
  const [description, setDescription] = useDebouncedState(
    section?.description || "",
    setIsSaving
  );
  const [options, setOptions] = useDebouncedState(
    section?.options?.data?.map((o) => o?.option) || [""],
    setIsSaving
  );
  const [charts, setCharts] = useDebouncedState(
    section?.items?.data?.map((c) => c?.text) || [""],
    setIsSaving
  );

  // Original
  const [original, setOriginal] = useState({
    chartsTitle: section?.items?.title,
    optionsTitle: section?.options?.title,
    description: section?.description || "",
    charts: section?.items?.data?.map((c) => c?.text) || [""],
    options: section?.options?.data?.map((a) => a?.option) || [""],
  });

  // Check if content has changed
  const hasContentChanged =
    chartsTitle !== original.chartsTitle ||
    description !== original.description ||
    optionsTitle !== original.optionsTitle ||
    JSON.stringify(charts) !== JSON.stringify(original.charts) ||
    JSON.stringify(options) !== JSON.stringify(original.options);

  const handleNavigate = () => {
    const path = `/tests/test/${testId}/preview/${module}/${partNumber}#s-${sectionIndex}`;
    navigate(path);
  };

  const handleSaveContent = () => {
    // Count answer inputs
    let totalInputs = 0;
    const target = `<span data-name="dropzone"></span>`;

    charts?.forEach((content) => {
      totalInputs += countExactMatches(content, target);
    });

    // Update section data from store
    const sectionData = {
      description,
      questionsCount: totalInputs,
      items: {
        title: chartsTitle,
        data: charts.map((c) => ({ text: c })),
      },
      options: {
        title: optionsTitle,
        data: options.map((o) => ({ option: o })),
      },
    };

    handleNavigate(); // Navigate user to preview page
    setIsSaving(false); // Remove saving loader
    updateSection(partNumber, sectionData, sectionIndex);

    // Update original content to match current content
    setOriginal({ chartsTitle, optionsTitle, description, charts, options });
  };

  return (
    <>
      {/* Header */}
      <EditorHeader
        isSaving={isSaving}
        title="Bloklar sxemasi"
        handleNavigate={handleNavigate}
        initialDescription={description}
        originalContent={original.content}
        onDescriptionChange={setDescription}
        hasContentChanged={hasContentChanged}
        handleSaveContent={handleSaveContent}
      />

      {/* Editor */}
      <div className="container">
        <div className="flex gap-3.5 w-full pb-5">
          <Flowchart
            onChange={setCharts}
            initialcharts={charts}
            initialTitle={chartsTitle}
            onTitleChange={setChartsTitle}
          />
          <Options
            onChange={setOptions}
            initialOptions={options}
            initialTitle={optionsTitle}
            onTitleChange={setOptionsTitle}
          />
        </div>
      </div>
    </>
  );
};

const Flowchart = ({
  onChange,
  initialTitle,
  onTitleChange,
  initialcharts,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [charts, setCharts] = useState(initialcharts || []);

  const handleAddChart = useCallback(() => {
    setCharts((prev) => (prev.length < 50 ? [...prev, ""] : prev));
  }, []);

  const handleDeleteChart = useCallback((index) => {
    setCharts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleChartChange = (v, index) => {
    setCharts((prev) => {
      return prev.map((val, i) => (i === index ? v : val));
    });
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    onTitleChange?.(e.target.value);
  };

  useEffect(() => {
    onChange?.(charts);
  }, [JSON.stringify(charts)]);

  return (
    <div className="shrink-0 w-2/3 h-full pt-5">
      {/* Title */}
      <div className="mb-5">
        <label htmlFor="flowchart-options-title" className="inline-block mb-1">
          Bloklar sarlavhasi
        </label>

        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          id="flowchart-options-title"
          name="flowchart-options-title"
          placeholder="Sarlavhani kiriting"
          className="w-full h-9 border rounded-md px-2"
        />
      </div>

      {/* Charts */}
      <div className="mb-3 space-y-5">
        {charts.map((value, index) => (
          <section key={index}>
            <div className="flex items-center justify-between">
              <h2 className="mb-1.5 font-bold">Blok {index + 1}</h2>

              {/* Delete btn */}
              <button
                onClick={() => handleDeleteChart(index)}
                className="flex items-center justify-center size-6"
              >
                <Trash color="red" size={16} />
              </button>
            </div>

            <RichTextEditor
              notSticky
              allowDropzone
              initialContent={value}
              onChange={(v) => handleChartChange(v, index)}
            />
          </section>
        ))}
      </div>

      {/* Add new chart */}
      <button
        onClick={handleAddChart}
        className="flex items-center justify-center w-56 h-9 bg-blue-100 text-blue-500 rounded-md mx-auto"
      >
        Blok qo'shish +
      </button>
    </div>
  );
};

const Options = ({ onChange, initialOptions, onTitleChange, initialTitle }) => {
  const [title, setTitle] = useState(initialTitle);
  const [inputs, setInputs] = useState(initialOptions);

  const handleAddInput = useCallback(() => {
    setInputs((prev) => (prev.length < 50 ? [...prev, ""] : prev));
  }, []);

  const handleDeleteInput = useCallback((index) => {
    setInputs((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleInputChange = (e, index) => {
    setInputs((prev) => {
      return prev.map((val, i) => {
        return i === index ? e.target.value : val;
      });
    });
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    onTitleChange?.(e.target.value);
  };

  useEffect(() => {
    onChange?.(inputs);
  }, [String(inputs)]);

  return (
    <div className="sticky top-0 overflow-y-auto w-full max-h-[calc(100vh-20px)] bg-gray-50 p-2.5 rounded-b-xl">
      <h2 className="mb-3 text-lg font-bold">Variantlar</h2>

      {/* Title */}
      <div className="mb-5">
        <label htmlFor="flowchart-options-title" className="inline-block mb-1">
          Sarlavha
        </label>

        <input
          type="text"
          value={title}
          id="flowchart-options-title"
          onChange={handleTitleChange}
          name="flowchart-options-title"
          placeholder="Sarlavhani kiriting"
          className="w-full h-9 border rounded-md px-2"
        />
      </div>

      {/* Options */}
      <div className="mb-3 space-y-2">
        {inputs.map((value, index) => (
          <div key={index}>
            <div className="flex items-center justify-between">
              <label
                className="inline-block mb-1"
                htmlFor={`flowchart-option-${index}`}
              >
                Variant {index + 1}
              </label>

              {/* Delete btn */}
              <button
                onClick={() => handleDeleteInput(index)}
                className="flex items-center justify-center size-6"
              >
                <Trash color="red" size={16} />
              </button>
            </div>

            <input
              type="text"
              value={value}
              id={`flowchart-option-${index}`}
              placeholder={`Variant ${index + 1}`}
              className="w-full h-9 border rounded-md px-2"
              onChange={(e) => handleInputChange(e, index)}
            />
          </div>
        ))}
      </div>

      {/* Add new option */}
      <button
        onClick={handleAddInput}
        className="flex items-center justify-center w-full h-9 bg-blue-100 text-blue-500 rounded-md"
      >
        Variant qo'shish +
      </button>
    </div>
  );
};

const ErrorContent = () => <i>Hmmm... Nimadir noto'g'ri ketdi!</i>;

export default FlowchartEditor;
