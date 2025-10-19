// Components
import Button from "../form/Button";

// Api
import { testsApi } from "@/api/tests.api";

// Toast
import { toast } from "@/notification/toast";

// Router
import { useNavigate } from "react-router-dom";

// Components
import ResponsiveModal from "../ResponsiveModal";

// Hooks
import useArrayStore from "@/hooks/useArrayStore";
import useObjectStore from "@/hooks/useObjectStore";
import usePathSegments from "@/hooks/usePathSegments";

const DeleteTestModal = () => (
  <ResponsiveModal
    name="deleteTest"
    title="Testni o'chirish"
    description="Testni o'chirsangiz shablon ham o'chiriladi. Siz haqiqatdan ham ushbu testni o'chirmoqchimisiz?"
  >
    <Content />
  </ResponsiveModal>
);

const Content = ({ close, isLoading, setIsLoading, testId }) => {
  const navigate = useNavigate();
  const { pathSegments } = usePathSegments();
  const { deleteEntity } = useObjectStore("tests");
  const { invalidateCache } = useArrayStore("tests");

  const handleDelete = (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    let success = false;

    testsApi
      .delete(testId)
      .then(({ code, message }) => {
        if (code !== "testDeleted") throw new Error();

        success = true;
        invalidateCache();
        deleteEntity(testId);
        toast.success(message);
        invalidateCache("latestTests", true);

        // Navigate to tests page if on test page
        if (pathSegments[0] === "tests" && pathSegments[1]) {
          navigate(`/tests`);
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

      <Button variant="danger" className="w-32" onClick={handleDelete}>
        O'chirish
      </Button>
    </div>
  );
};

export default DeleteTestModal;
