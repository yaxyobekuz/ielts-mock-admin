// Components
import Button from "../form/Button";

// Api
import { linksApi } from "@/api/links.api";

// Toast
import { toast } from "@/notification/toast";

// Router
import { useNavigate } from "react-router-dom";

// Components
import ResponsiveModal from "../ResponsiveModal";

const DeleteLinkModal = () => (
  <ResponsiveModal
    name="deleteLink"
    title="Havolani o'chirish"
    description="Havolani o'chirsangiz, havola bilan bog'liq barcha ma'lumotlar o'chiriladi. Siz haqiqatdan ham ushbu havolani o'chirmoqchimisiz?"
  >
    <Content />
  </ResponsiveModal>
);

const Content = ({ close, isLoading, setIsLoading, linkId }) => {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    let success = false;

    linksApi
      .delete(linkId)
      .then(({ code, message }) => {
        if (code !== "linkDeleted") throw new Error();

        success = true;
        navigate(`/links`);
        toast.success(message || "Havola o'chirildi");
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => {
        success && close();
        setIsLoading(false);
      });
  };

  return (
    <div className="flex justify-end gap-5 w-full">
      <Button
        type="button"
        className="w-32"
        variant="neutral"
        onClick={() => close()}
      >
        Bekor qilish
      </Button>

      <Button
        type="submit"
        variant="danger"
        className="w-32"
        disabled={isLoading}
        onClick={handleDelete}
      >
        O'chirish
      </Button>
    </div>
  );
};

export default DeleteLinkModal;
