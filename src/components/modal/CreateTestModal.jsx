// React
import { useState } from "react";

// Components
import Input from "../form/Input";
import Button from "../form/Button";

// Api
import { testsApi } from "@/api/tests.api";

// Toast
import { toast } from "@/notification/toast";

// Router
import { useNavigate } from "react-router-dom";

// Hooks
import useModal from "@/hooks/useModal";
import useStore from "@/hooks/useStore";
import useMediaQuery from "@/hooks/useMediaQuery";
import useObjectState from "@/hooks/useObjectState";

// Ui components
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

const CreateTestModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { closeModal, isOpen } = useModal("createTest");
  const hanldeCloseModal = () => !isLoading && closeModal();

  const content = {
    title: "Test qo'shish",
    body: (
      <Body
        isLoading={isLoading}
        close={hanldeCloseModal}
        setIsLoading={setIsLoading}
      />
    ),
    description: `Yangi test qo'shish uchun sarlavhani kiriting, istasangiz rasm ham yuklang`,
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={hanldeCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          {/* Header */}
          <DialogHeader>
            <DialogTitle>{content.title}</DialogTitle>
            <DialogDescription>{content.description}</DialogDescription>
          </DialogHeader>

          {/* Body */}
          {content.body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={hanldeCloseModal}>
      <DrawerContent className="px-5 pb-5">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>

        {/* Body */}
        {content.body}
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ close, isLoading, setIsLoading }) => {
  const navigate = useNavigate();
  const { getData, updateProperty } = useStore("tests");
  const { isLoading: isTestsLoading, data: tests } = getData();

  const { title, description, setField } = useObjectState({
    title: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!title?.trim()?.length) {
      return toast.error("Sarlavha kiritilmadi");
    }

    setIsLoading(true);
    let success = false;

    testsApi
      .create({ title: title.trim(), description: description?.trim() || "" })
      .then(({ test, code }) => {
        if (code !== "testCreated") throw new Error();

        success = true;
        navigate(`/tests/${test._id}`);
        if (!isTestsLoading) updateProperty("data", [test, ...tests]);
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        required
        size="lg"
        border={true}
        variant="gray"
        maxLength={32}
        label="Sarlavha"
        name="test-title"
        placeholder="Sarlavhani kiriitng"
        onChange={(value) => setField("title", value)}
      />

      <Input
        size="lg"
        label="Izoh"
        border={true}
        variant="gray"
        type="textarea"
        maxLength={144}
        name="test-description"
        placeholder="Izoh (Ixtiyoriy)"
        onChange={(value) => setField("description", value)}
      />

      {/* Buttons */}
      <div className="flex justify-end gap-5 w-full">
        <Button
          type="button"
          onClick={() => close()}
          className="w-32"
          variant="neutral"
        >
          Bekor qilish
        </Button>

        <Button type="submit" className="w-32">
          Qo'shish
        </Button>
      </div>
    </form>
  );
};

export default CreateTestModal;
