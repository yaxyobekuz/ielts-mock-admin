// Hooks
import useStore from "@/hooks/useStore";

// React
import { useEffect } from "react";

// Templates api
import { templatesApi } from "@/api/templates.api";

// Components
import TemplateItem from "@/components/TemplateItem";

const Templates = () => {
  const { getData, updateProperty } = useStore("templates");
  const { isLoading, hasError, data: templates } = getData();

  const loadTemplates = () => {
    updateProperty("isLoading", true);
    updateProperty("hasError", false);

    templatesApi
      .get()
      .then(({ templates, code }) => {
        if (code !== "templatesFetched") throw new Error();
        updateProperty("data", templates);
      })
      .catch(() => updateProperty("hasError", true))
      .finally(() => updateProperty("isLoading", false));
  };

  // Load user profile
  useEffect(() => {
    isLoading && loadTemplates();
  }, []);

  return (
    <div className="container py-8 space-y-6">
      {/* Title */}
      <h1>Shablonlar</h1>

      {/* Main */}
      <main className="grid grid-cols-4 gap-5">
        <Main isLoading={isLoading} hasError={hasError} templates={templates} />
      </main>
    </div>
  );
};

const Main = ({ isLoading, hasError, templates = [] }) => {
  if (isLoading) {
    return Array.from({ length: 8 }, (_, index) => {
      return <TemplateItemSkeleton key={index} />;
    });
  }

  if (hasError) {
    return <div className="">Error</div>;
  }

  return templates.map((template) => (
    <TemplateItem key={template?._id} {...template} />
  ));
};

const TemplateItemSkeleton = () => (
  <div className="w-full min-h-52 bg-gray-100 rounded-3xl p-5 space-y-5 animate-pulse" />
);

export default Templates;
