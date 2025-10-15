// React
import { useEffect } from "react";

// Icons
import { Clock } from "lucide-react";

// Toast
import { toast } from "@/notification/toast";

// Router
import { useParams } from "react-router-dom";

// Api
import { templatesApi } from "@/api/templates.api";

// Hooks
import useModal from "@/hooks/useModal";
import useStore from "@/hooks/useStore";
import usePermission from "@/hooks/usePermission";
import useObjectState from "@/hooks/useObjectState";

// Components
import TemplateItem from "@/components/TemplateItem";

// Helpers
import { formatDate, formatTime } from "@/lib/helpers";

const Template = () => {
  const { templateId } = useParams();
  const { getProperty, updateProperty } = useStore("template");
  const template = getProperty(templateId);

  // Permissions
  const { checkPermission } = usePermission();
  const canUseTemplate = checkPermission("canUseTemplate");

  const { setField, isLoading, hasError } = useObjectState({
    hasError: false,
    isLoading: !template,
  });

  const loadTemplate = () => {
    setField("hasError");
    setField("isLoading", true);

    templatesApi
      .getById(templateId)
      .then(({ code, template, extraTemplates }) => {
        if (code !== "templateFetched") throw new Error();
        updateProperty(templateId, { ...template, extraTemplates });
      })
      .catch(({ message }) => {
        setField("hasError", true);
        toast.error(message || "Nimadir xato ketdi");
      })
      .finally(() => setField("isLoading"));
  };

  useEffect(() => {
    !template && loadTemplate();
  }, [templateId]);

  return (
    <div className="container py-8 space-y-6">
      <Content
        {...template}
        hasError={hasError}
        isLoading={isLoading}
        canUseTemplate={canUseTemplate}
      />
    </div>
  );
};

const Content = ({
  title,
  images,
  hasError,
  createdAt,
  isLoading,
  description,
  canUseTemplate,
  extraTemplates,
}) => {
  const { templateId } = useParams();
  const { openModal } = useModal("useTemplate");

  if (isLoading) return <LoadingContent />;
  if (hasError) return <ErrorContent />;

  return (
    <>
      {/* Top */}
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1>{title}</h1>

        <div className="flex items-center gap-5">
          <div title="Vaqt" className="flex items-center gap-1.5">
            <Clock strokeWidth={1.5} size={22} />
            <span>{formatDate(createdAt)}</span>
            <span className="text-gray-500">{formatTime(createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-5">
        <button
          disabled={!canUseTemplate}
          onClick={() => canUseTemplate && openModal({ templateId })}
          className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
        >
          Shablondan nusxa ko'chirish
        </button>
      </div>

      {/* Main */}
      <div className="flex gap-5">
        {/* Details */}
        <div className="w-full space-y-5">
          {/* Description */}
          <p className="text-gray-500 text-lg">{description}</p>

          {/* Images */}
          {images?.map(({ sizes, _id }) => (
            <img
              key={_id}
              width={1075}
              src={sizes.large.url}
              alt="Test ko'rinish rasmi"
              className="w-full bg-gray-100 rounded-3xl"
            />
          ))}
        </div>

        {/* Extra templates */}
        <section className="w-[345px] shrink-0 space-y-5">
          <h2 className="text-xl font-medium">Boshqa shablonlar</h2>
          {extraTemplates?.map((template) => (
            <TemplateItem
              {...template}
              key={template._id}
              canUseTemplate={canUseTemplate}
            />
          ))}
        </section>
      </div>
    </>
  );
};

const LoadingContent = () => {
  return (
    <>
      {/* Top */}
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1>Shablon yuklanmoqda...</h1>

        <div className="flex items-center gap-5 animate-pulse">
          <div className="btn w-48 h-6 bg-gray-100 py-0 rounded-lg" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-5 animate-pulse">
        <div className="btn w-60 h-11 bg-gray-100 py-0 rounded-full" />
      </div>

      <div className="flex gap-5 animate-pulse">
        {/* Details */}
        <div className="w-full space-y-5">
          {/* Description */}
          <div className="space-y-1.5">
            <div className="btn w-2/3 h-6 bg-gray-100 py-0 rounded-lg" />
            <div className="btn w-full h-6 bg-gray-100 py-0 rounded-lg" />
            <div className="btn w-full h-6 bg-gray-100 py-0 rounded-lg" />
          </div>

          {/* Images */}
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="w-full h-[512px] bg-gray-100 rounded-3xl"
            />
          ))}
        </div>

        {/* Extra templates */}
        <di className="w-[345px] shrink-0 space-y-5">
          <div className="btn w-44 h-6 bg-gray-100 py-0 rounded-lg" />

          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="w-full min-h-52 bg-gray-100 rounded-3xl"
            />
          ))}
        </di>
      </div>
    </>
  );
};

const ErrorContent = () => {
  return <div className="">Error</div>;
};

export default Template;
