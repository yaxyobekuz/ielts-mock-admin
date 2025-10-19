// Components
import Input from "../form/Input";
import Button from "../form/Button";

// Toast
import { toast } from "@/notification/toast";

// Helpers
import { extractNumbers } from "@/lib/helpers";

// Api
import { teachersApi } from "@/api/teachers.api";

// Components
import ResponsiveModal from "../ResponsiveModal";

// Hooks
import useArrayStore from "@/hooks/useArrayStore";
import useObjectState from "@/hooks/useObjectState";

const CreateTeacherModal = () => (
  <ResponsiveModal
    name="createTeacher"
    title="Ustoz qo'shish"
    description="Yangi ustoz qo'shish uchun telefon raqam va parolni kiriting"
  >
    <Content />
  </ResponsiveModal>
);

const Content = ({ close, isLoading, setIsLoading }) => {
  const { invalidateCache } = useArrayStore("teachers");

  const { setField, password, phone } = useObjectState({
    title: "",
    phone: "",
    image: null,
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    const formattedPassword = password?.trim() || "";
    const formattedPhone = extractNumbers(phone) || "";

    if (formattedPassword.length < 4) {
      return toast.error("Parol juda ham qisqa");
    }

    if (formattedPhone.length !== 12) {
      return toast.error("Telefon raqam noto'g'ri kiritildi");
    }

    setIsLoading(true);
    let success = false;

    teachersApi
      .create({ password: formattedPassword, phone: formattedPhone })
      .then(({ message, code }) => {
        if (code !== "teacherCreated") throw new Error();

        success = true;
        invalidateCache();
        toast.success(message);
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => {
        success && close();
        setIsLoading(false);
      });
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
          className="w-32"
          variant="neutral"
          onClick={() => close()}
        >
          Bekor qilish
        </Button>

        <Button disabled={isLoading} className="w-32">
          Qo'shish
        </Button>
      </div>
    </form>
  );
};

export default CreateTeacherModal;
