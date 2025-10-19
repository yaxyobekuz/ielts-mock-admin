// Components
import Button from "../form/Button";

// Toast
import { toast } from "@/notification/toast";

// Router
import { useNavigate } from "react-router-dom";

// Api
import { teachersApi } from "@/api/teachers.api";

// Components
import ResponsiveModal from "../ResponsiveModal";

// Hooks
import useArrayStore from "@/hooks/useArrayStore";
import useObjectStore from "@/hooks/useObjectStore";
import usePathSegments from "@/hooks/usePathSegments";

const DeleteTeacherModal = () => (
  <ResponsiveModal
    name="deleteTeacher"
    title="Ustozni o'chirish"
    description="Siz haqiqatdan ham ushbu ustozni o'chirmoqchimisiz?"
  >
    <Content />
  </ResponsiveModal>
);

const Content = ({ close, isLoading, setIsLoading, teacherId }) => {
  const navigate = useNavigate();
  const { pathSegments } = usePathSegments();
  const { deleteEntity } = useObjectStore("teachers");
  const { invalidateCache } = useArrayStore("teachers");

  const handleDelete = (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    let success = false;

    teachersApi
      .delete(teacherId)
      .then(({ code, message }) => {
        if (code !== "teacherDeleted") throw new Error();

        success = true;
        invalidateCache();
        toast.success(message);
        deleteEntity(teacherId);

        // Navigate to teachers page if on teacher page
        if (pathSegments[0] === "teachers" && pathSegments[1]) {
          navigate(`/teachers`);
        }
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

export default DeleteTeacherModal;
