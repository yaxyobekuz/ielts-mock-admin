// React
import { useState } from "react";

// Hooks
import useModal from "@/hooks/useModal";
import useModule from "@/hooks/useModule";

// Api
import { partsApi } from "@/api/parts.api";

// Toast
import { toast } from "@/notification/toast";

// Router
import { useNavigate } from "react-router-dom";

// Components
import ConfirmationModalContent from "../ConfirmationModalContent";

const DeletePartModal = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, data, closeModal } = useModal("deletePart");

  const { testId, partId, module, partNumber } = data || {};
  const { deletePart } = useModule(module, testId);
  const prevPartNumber = Math.max(parseInt(partNumber) - 1, 1);

  const handleDelete = () => {
    setIsLoading(true);

    partsApi
      .delete(partId)
      .then(({ code, message }) => {
        if (code !== "partDeleted") throw new Error();

        deletePart(data);
        toast.success(message || "Qism o'chirildi");
        navigate(`/tests/${testId}/preview/${module}/${prevPartNumber}`);
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
      title="Qismni o'chirish"
      onClose={handleCloseModal}
      description="Siz haqiqatan ham ushbu qismni o'chirmoqchimisiz?"
    />
  );
};

export default DeletePartModal;
