// Icons
import {
  Edit,
  Clock,
  Trash,
  Grid2x2,
  LinkIcon,
  Columns2,
  RefreshCcw,
  Grid2x2Plus,
  ArrowUpRight,
} from "lucide-react";

// Api
import { testsApi } from "@/api/tests.api";
import { linksApi } from "@/api/links.api";

// Toast
import { toast } from "@/notification/toast";

// React
import { useCallback, useEffect } from "react";

// Components
import CopyButton from "@/components/CopyButton";

// Router
import { Link, useParams } from "react-router-dom";

// Hooks
import useModal from "@/hooks/useModal";
import useStore from "@/hooks/useStore";
import useModule from "@/hooks/useModule";
import usePermission from "@/hooks/usePermission";
import useObjectState from "@/hooks/useObjectState";

// Helpers
import { formatDate, formatTime } from "@/lib/helpers";

// Backgrounds
import readingBg from "@/assets/backgrounds/reading.webp";
import writingBg from "@/assets/backgrounds/writing.webp";
import listeningBg from "@/assets/backgrounds/listening.webp";

const Test = () => {
  const { testId } = useParams();
  const { setModule } = useModule();
  const { getProperty, updateProperty } = useStore("test");
  const test = getProperty(testId);

  const { setField, isLoading, hasError } = useObjectState({
    hasError: false,
    isLoading: !test,
  });

  const loadTest = () => {
    setField("hasError");
    setField("isLoading", true);

    testsApi
      .getById(testId)
      .then(({ code, test }) => {
        if (code !== "testFetched") throw new Error();

        updateProperty(testId, test);
        setModule(test.reading, test._id, "reading");
        setModule(test.writing, test._id, "writing");
        setModule(test.listening, test._id, "listening");
      })
      .catch(({ message }) => {
        setField("hasError", true);
        toast.error(message || "Nimadir xato ketdi");
      })
      .finally(() => setField("isLoading"));
  };

  useEffect(() => {
    isLoading && loadTest();
  }, []);

  return (
    <div className="container py-8 space-y-6">
      <Content isLoading={isLoading} hasError={hasError} {...test} />
    </div>
  );
};

const modules = [
  {
    title: "Listening",
    image: listeningBg,
    link(testId) {
      return `/tests/${testId}/preview/listening/1`;
    },
  },
  {
    title: "Reading",
    image: readingBg,
    link(testId) {
      return `/tests/${testId}/preview/reading/1`;
    },
  },
  {
    title: "Writing",
    image: writingBg,
    link(testId) {
      return `/tests/${testId}/preview/writing/1`;
    },
  },
];

const Content = ({
  title,
  hasError,
  template,
  createdAt,
  isLoading,
  totalParts,
  isTemplate,
  description,
  ...rest
}) => {
  const { testId } = useParams();
  const { checkPermission } = usePermission();
  const { openModal } = useModal("createLink");

  // Permissions
  const canEditTest = checkPermission("canEditTest");
  const canDeleteTest = checkPermission("canDeleteTest");
  const canCreateLink = checkPermission("canCreateLink");
  const canCreateTemplate = checkPermission("canCreateTemplate");

  const openCreateTemplateModal = useCallback(() => {
    if (!canCreateTemplate) return;
    openModal({ testId }, "createTemplate");
  }, [testId]);

  const openEditTestModal = useCallback(() => {
    if (!canEditTest) return;
    openModal({ testId, description, title }, "editTest");
  }, [testId, description, title]);

  if (isLoading) return <LoadingContent />;
  if (hasError) return <ErrorContent />;

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1>{title}</h1>

        <div className="flex items-center gap-5">
          {/* Total parts */}
          <div title="Jami sahifalar" className="flex items-center gap-1.5">
            <Columns2 strokeWidth={1.5} size={22} />
            <span>{totalParts}ta</span>
          </div>

          {/* Parts count */}
          <div title="Vaqt" className="flex items-center gap-1.5">
            <Clock strokeWidth={1.5} size={22} />
            <span>
              {formatDate(createdAt)} {formatTime(createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-5">
        {/* Open edit test modal button */}
        <button
          disabled={!canEditTest}
          onClick={openEditTestModal}
          className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
        >
          <Edit size={20} strokeWidth={1.5} />
          Tahrirlash
        </button>

        {/* Template link */}
        {isTemplate && (
          <Link
            to={`/templates/${template}`}
            className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
          >
            <Grid2x2 size={20} strokeWidth={1.5} />
            Shablonni ko'rish
          </Link>
        )}

        {/* Open create template modal button */}
        {!isTemplate && (
          <button
            disabled={!canCreateTemplate}
            onClick={openCreateTemplateModal}
            className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
          >
            <Grid2x2Plus size={20} strokeWidth={1.5} />
            Shablon yaratish
          </button>
        )}

        {/* Open create link modal button */}
        <button
          disabled={!canCreateLink}
          onClick={() => openModal({ testId })}
          className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
        >
          <LinkIcon size={20} strokeWidth={1.5} />
          Taklif havolasini yaratish
        </button>

        {/* Open delete test modal button */}
        <button
          title="Testni o'chirish"
          disabled={!canDeleteTest}
          aria-label="Testni o'chirish"
          onClick={() => openModal({ testId }, "deleteTest")}
          className="btn size-11 bg-red-50 p-0 rounded-full text-red-500 hover:bg-red-100 disabled:opacity-50 disabled:hover:bg-red-50"
        >
          <Trash size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {/* Modules */}
        <ul className="grid grid-cols-3 gap-5 col-span-3">
          {modules.map(({ image, title, link }, index) => {
            const partsCount = rest[title?.toLowerCase()]?.partsCount || 0;
            return (
              <li
                key={index}
                style={{ backgroundImage: `url(${image})` }}
                className="flex flex-col relative overflow-hidden w-full h-auto aspect-square bg-cover bg-center bg-no-repeat bg-gray-100 rounded-3xl"
              >
                <div className="flex items-center justify-end p-5">
                  {/* Link */}
                  <div className="btn size-10 p-0 rounded-full bg-white backdrop-blur-sm">
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                {/* Bottom */}
                <div className="w-full bg-gradient-to-b from-transparent to-black/80 mt-auto p-5 space-y-3">
                  <h2 className="text-xl font-medium text-white">{title}</h2>

                  <div className="flex items-center justify-between gap-4">
                    {/* Parts count */}
                    <div
                      title="Sahifalar"
                      className="flex items-center gap-1.5 text-gray-200"
                    >
                      <Columns2 strokeWidth={1.5} size={18} />
                      <span>{partsCount}ta</span>
                    </div>

                    {/* Last update */}
                    <div
                      title="Oxirgi yangilanish"
                      className="flex items-center gap-1.5 text-gray-200"
                    >
                      <RefreshCcw strokeWidth={1.5} size={18} />
                      <span>{formatDate(new Date())}</span>
                    </div>
                  </div>
                </div>

                {/* Link */}
                <Link
                  to={link(testId)}
                  className="block absolute z-0 -top-5 inset-0 size-full rounded-3xl"
                />
              </li>
            );
          })}
        </ul>

        {/* Invite links */}
        <Links testId={testId} />
      </div>
    </>
  );
};

const LoadingContent = () => {
  return (
    <>
      <h1>Test</h1>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-5">
        <div className="btn w-56 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200" />{" "}
      </div>

      <ul className="grid grid-cols-4 gap-5 animate-pulse">
        {Array.from({ length: 4 }, (_, index) => (
          <li
            key={index}
            className="h-auto aspect-square bg-gray-100 rounded-3xl"
          />
        ))}
      </ul>
    </>
  );
};

const ErrorContent = () => {
  return <div className="">Error</div>;
};

const Links = ({ testId }) => {
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const { getProperty, updateProperty } = useStore("testLinks");
  const links = getProperty(testId);
  const { setField, isLoading, hasError } = useObjectState({
    hasError: false,
    isLoading: !links,
  });

  const loadLinks = () => {
    setField("hasError");
    setField("isLoading", true);

    linksApi
      .get(testId)
      .then(({ code, links }) => {
        if (code !== "linksFetched") throw new Error();
        updateProperty(testId, links);
      })
      .catch(() => setField("hasError", true))
      .finally(() => setField("isLoading"));
  };

  useEffect(() => {
    isLoading && loadLinks();
  }, []);

  return (
    <section className="flex flex-col gap-5 overflow-hidden w-full h-auto bg-gray-100 bg-cover bg-no-repeat aspect-square p-5 rounded-3xl">
      {/* Title */}
      <h2 className="text-xl font-medium">Taklif havolalari</h2>

      <ul className="space-y-3 max-h-[calc(100%-50px)] overflow-auto scroll-y-primary scroll-smooth">
        {/* Skeleton Loader */}
        {isLoading && !hasError
          ? Array.from({ length: 5 }, (_, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-2 pr-1 relative animate-pulse"
              >
                <div className="flex items-center gap-2 w-full">
                  {/* Index */}
                  <div className="shrink-0 size-11 bg-gray-200 rounded-full" />

                  {/* Details */}
                  <div className="w-full space-y-1.5">
                    <div className="w-1/2 h-4 bg-gray-200 rounded-md" />
                    <div className="w-4/5 h-3.5 bg-gray-200 rounded-md" />
                  </div>
                </div>
              </li>
            ))
          : null}

        {/* Tests */}
        {!isLoading && !hasError
          ? links.map(({ title, usedCount, _id: id }) => (
              <li
                key={id}
                className="flex items-center justify-between gap-2 pr-1 relative"
              >
                <div className="flex items-center gap-2">
                  {/* Copy button */}
                  <CopyButton
                    text={`${siteUrl}/link/${id}`}
                    icon={{ size: 18, strokeWidth: 1.5 }}
                    notificationText="Havoladan nusxa olindi"
                    className="flex items-center justify-center relative z-10 shrink-0 size-11 bg-blue-500 rounded-full text-white font-medium transition-opacity duration-200 disabled:opacity-50"
                  />

                  <div className="space-y-1">
                    {/* Title */}
                    <h3 className="capitalize line-clamp-1 font-medium">
                      {title}
                    </h3>

                    {/* Used count */}
                    <span className="line-clamp-1 text-sm text-gray-500">
                      {usedCount}ta foydalanilindi
                    </span>
                  </div>
                </div>

                {/* Button */}
                <Link to={`/links/${id}`} className="block absolute z-0 inset-0 size-full -outline-offset-1 rounded-full" />
              </li>
            ))
          : null}
      </ul>

      {/* Error */}
      {!isLoading && hasError ? (
        <p className="text-gray-500">Nimadir xato ketdi...</p>
      ) : null}
    </section>
  );
};

export default Test;
