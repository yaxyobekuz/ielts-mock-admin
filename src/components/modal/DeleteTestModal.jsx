// Components
import Button from "../form/Button";

// Hooks
import useStore from "@/hooks/useStore";

// Api
import { testsApi } from "@/api/tests.api";

// Toast
import { toast } from "@/notification/toast";

// Router
import { useNavigate } from "react-router-dom";

// Components
import ResponsiveModal from "../ResponsiveModal";

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
  const { getData, updateProperty } = useStore("tests");
  const { isLoading: isTestsLoading, data: tests } = getData();

  const { getData: getSingleTests, updateProperty: updateSingleTest } =
    useStore("test");
  const singleTests = getSingleTests();

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
        navigate(`/tests`);
        toast.success(message || "Test o'chirildi");

        // Delete test from store
        if (!isTestsLoading) {
          const filtered = tests.filter(({ _id: id }) => id !== testId);
          updateProperty("data", filtered);
        }

        // Delete single test from store
        if (singleTests[testId]) {
          updateSingleTest(testId, null);
        }
      })
      .catch(({ message }) =>
        toast.error(message || "Noma'lum xatolik yuz berdi")
      )
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
        onClick={handleDelete}
      >
        O'chirish
      </Button>
    </div>
  );
};

export default DeleteTestModal;
