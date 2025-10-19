// Toast
import { toast } from "@/notification/toast";

// React
import { useCallback, useEffect } from "react";

// Router
import { useSearchParams } from "react-router-dom";

// Hooks
import useArrayStore from "@/hooks/useArrayStore";
import usePermission from "@/hooks/usePermission";

// Templates api
import { templatesApi } from "@/api/templates.api";

// Components
import PageInfo from "@/components/PageInfo";
import Pagination from "@/components/Pagination";
import TemplateItem from "@/components/TemplateItem";

const Templates = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const {
    setPage,
    initialize,
    getMetadata,
    getPageData,
    hasCollection,
    setPageErrorState,
    setPageLoadingState,
  } = useArrayStore("templates");

  // Initialize collection on mount
  useEffect(() => {
    if (!hasCollection()) initialize(true); // pagination = true
  }, [hasCollection, initialize]);

  const metadata = getMetadata();
  const pageData = getPageData(currentPage);

  const templates = pageData?.data || [];
  const hasError = pageData?.error || null;
  const isLoading = pageData?.isLoading || false;
  const hasNextPage = pageData?.hasNextPage ?? false;
  const hasPrevPage = pageData?.hasPrevPage ?? false;

  // Load templates for current page
  const loadTemplates = useCallback(
    (page) => {
      setPageLoadingState(page, true);

      templatesApi
        .get({ page, limit: 12 })
        .then(({ templates, code, pagination }) => {
          if (code !== "templatesFetched") throw new Error();
          setPage(page, templates, null, pagination);
        })
        .catch(({ message }) => {
          toast.error(message || "Nimadir xato ketdi");
          setPageErrorState(page, message || "Nimadir xato ketdi");
        });
    },
    [setPageLoadingState, setPage, setPageErrorState]
  );

  // Navigate to page
  const goToPage = useCallback(
    (page) => {
      if (page < 1) return;
      setSearchParams({ page: page.toString() });
    },
    [setSearchParams]
  );

  // Load templates when page changes
  useEffect(() => {
    const pageDataExists = getPageData(currentPage);
    if (!pageDataExists) loadTemplates(currentPage);
  }, [currentPage, loadTemplates, getPageData]);

  return (
    <div className="container py-8 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1>Shablonlar</h1>

        {/* Pagination Info */}
        {!isLoading && !hasError && templates.length > 0 && metadata && (
          <div className="flex items-center gap-3 text-gray-500">
            <span>
              Hozirgi sahifa:{" "}
              <strong className="font-medium text-black">{currentPage}</strong>{" "}
              / {metadata.totalPages}
            </span>

            <span className="size-1 bg-gray-400 rounded-full" />

            <span>
              Jami shablonlar:{" "}
              <strong className="font-medium text-black">
                {metadata.total}
              </strong>{" "}
              ta
            </span>
          </div>
        )}
      </div>

      {/* Main */}
      <main>
        {/* Skeleton loader */}
        {isLoading && !hasError ? (
          <ul className="grid grid-cols-4 gap-5 animate-pulse">
            {Array.from({ length: 12 }, (_, index) => (
              <TemplateItemSkeleton key={index} />
            ))}
          </ul>
        ) : null}

        {/* Error content */}
        {!isLoading && hasError ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-red-500 text-lg">{hasError}</p>
            <button
              onClick={() => loadTemplates(currentPage)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Qayta urinib ko'rish
            </button>
          </div>
        ) : null}

        {/* No templates */}
        {!isLoading && !hasError && templates.length === 0 ? (
          <PageInfo
            className="pt-12"
            title="Hech qanday shablon topilmadi"
            links={{
              primary: { to: "/templates", body: "1-sahifaga qaytish" },
            }}
            description={`Ushbu ${currentPage}-sahifada hech qanday shablon topilmadi.`}
          />
        ) : null}

        {/* Templates */}
        {!isLoading && !hasError && templates.length > 0 ? (
          <MainContent templates={templates} />
        ) : null}
      </main>

      {/* Pagination Controls */}
      {!isLoading && !hasError && templates.length > 0 && (
        <Pagination
          className="pt-4"
          maxPageButtons={5}
          showPageNumbers={true}
          onPageChange={goToPage}
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          totalPages={metadata?.totalPages || 1}
        />
      )}
    </div>
  );
};

const MainContent = ({ templates = [] }) => {
  // Permissions
  const { checkPermission } = usePermission();
  const canUseTemplate = checkPermission("canUseTemplate");

  return (
    <div className="grid grid-cols-4 gap-5">
      {templates.map((template) => (
        <TemplateItem
          {...template}
          key={template?._id}
          canUseTemplate={canUseTemplate}
        />
      ))}
    </div>
  );
};

const TemplateItemSkeleton = () => (
  <div className="w-full min-h-52 bg-gray-100 rounded-3xl p-5" />
);

export default Templates;
