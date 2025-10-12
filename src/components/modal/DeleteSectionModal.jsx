// React
import { useState } from "react";

// Hooks
import useModal from "@/hooks/useModal";
import useModule from "@/hooks/useModule";

// Toast
import { toast } from "@/notification/toast";

// Api
import { sectionsApi } from "@/api/sections.api";

// Components
import ConfirmationModalContent from "../ConfirmationModalContent";

const DeleteSectionModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, data, closeModal } = useModal("deleteSection");
  const { testId, sectionId, module } = data || {};

  const { deleteSection } = useModule(module, testId);
  const handleDelete = () => {
    setIsLoading(true);

    sectionsApi
      .delete(sectionId)
      .then(({ code, message }) => {
        if (code !== "sectionDeleted") throw new Error();

        deleteSection(data);
        toast.success(message || "Bo'lim o'chirildi");
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => {
        closeModal();
        setIsLoading(false);
      });
  };

  const handleCloseModal = () => {
    if (!isLoading) closeModal();
  };

  return (
    <ConfirmationModalContent
      isOpen={isOpen}
      variant="danger"
      isLoading={isLoading}
      onSubmit={handleDelete}
      actionLabel="O'chirish"
      title="Bo'limni o'chirish"
      onClose={handleCloseModal}
      description="Siz haqiqatan ham ushbu bo'limni o'chirmoqchimisiz?"
    />
  );
};

export default DeleteSectionModal;
