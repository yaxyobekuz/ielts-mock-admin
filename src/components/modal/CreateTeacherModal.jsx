// Ui components
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerFooter,
  DrawerContent,
} from "@/components/ui/drawer";

// Components
import Input from "../form/Input";
import Button from "../form/Button";

// Toast
import { toast } from "@/notification/toast";

// Helpers
import { extractNumbers } from "@/lib/helpers";

// Router
import { useNavigate } from "react-router-dom";

// Api
import { teachersApi } from "@/api/teachers.api";

// Hooks
import useModal from "@/hooks/useModal";
import useStore from "@/hooks/useStore";
import useMediaQuery from "@/hooks/useMediaQuery";
import useObjectState from "@/hooks/useObjectState";

const CreateTeacherModal = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { closeModal, isOpen } = useModal("createTeacher");

  const content = {
    title: "Ustoz qo'shish",
    body: <Body close={closeModal} />,
    description: `Yangi ustoz qo'shish uchun telefon raqam va parolni kiriting`,
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={closeModal}>
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
    <Drawer open={isOpen} onOpenChange={closeModal}>
      <DrawerContent>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>

        {/* Body */}
        {content.body}

        {/* Footer */}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <button variant="outline">Bekor qilish</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ close }) => {
  const navigate = useNavigate();
  const { getData, updateProperty } = useStore("teachers");
  const { isLoading: isTeachersLoading, data: teachers } = getData();

  const { setField, password, phone } = useObjectState({
    title: "",
    phone: "",
    image: null,
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || password.trim().length < 4) {
      return toast.error("Parol juda ham qisqa");
    }

    if (!phone || extractNumbers(phone).trim().length !== 12) {
      return toast.error("Telefon raqam noto'g'ri kiritildi");
    }

    toast.promise(
      teachersApi
        .create({ password: password.trim(), phone: extractNumbers(phone) })
        .then(({ teacher, code }) => {
          if (code !== "teacherCreated") throw new Error();

          navigate(`/teachers/${teacher._id}`);

          if (!isTeachersLoading) {
            updateProperty("data", [teacher, ...teachers]);
          }
        })
        .finally(close),
      {
        error: "Ustoz qo'shilmadi!",
        success: "Ustoz qo'shildi!",
        loading: "Ustoz qo'shilmoqda...",
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Phone */}
      <Input
        border
        required
        size="lg"
        type="tel"
        value={phone}
        variant="gray"
        maxLength={19}
        label="Tel raqam"
        name="teacher-phone"
        placeholder="+998 (__) ___-__-__"
        onChange={(value) => setField("phone", value)}
      />

      {/* Password */}
      <Input
        border
        required
        size="lg"
        label="Parol"
        variant="gray"
        maxLength={96}
        type="password"
        value={password}
        name="teacher-password"
        placeholder="Parolni kiriting"
        onChange={(value) => setField("password", value)}
      />

      {/* Buttons */}
      <div className="flex justify-end gap-5 w-full">
        <Button
          type="button"
          onClick={()=> close()}
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

export default CreateTeacherModal;
