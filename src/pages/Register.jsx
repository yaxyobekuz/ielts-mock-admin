// Api
import { authApi } from "@/api/auth.api";

// Toast
import { toast } from "@/notification/toast";

// Components
import Input from "@/components/form/Input";
import Button from "@/components/form/Button";

// Helpers
import { extractNumbers } from "@/lib/helpers";

// Router
import { useNavigate } from "react-router-dom";

// Hooks
import useObjectState from "@/hooks/useObjectState";

const Register = () => {
  const { state, setField } = useObjectState({
    step: 1,
    phone: "",
    password: "",
    firstName: "",
  });
  const { phone, step, firstName, password } = state;

  const handleNext = ({ phone, firstName, password }) => {
    setField("step", 2);
    setField("phone", phone);
    setField("password", password);
    setField("firstName", firstName);
  };

  // Steps
  if (step === 1) {
    return <RegisterContent next={handleNext} />;
  }

  return (
    <VerifyCodeContent
      phone={phone}
      password={password}
      firstName={firstName}
    />
  );
};

const RegisterContent = ({ next }) => {
  const navigate = useNavigate();
  const { state, setField } = useObjectState({
    phone: "",
    password: "",
    firstName: "",
    isLoading: false,
  });

  const { phone, password, firstName, isLoading } = state;

  const handleRegister = (e) => {
    e.preventDefault();
    if (isLoading) return;

    const formattedPassword = password?.trim() || "";
    const formattedPhone = extractNumbers(phone)?.trim() || "";

    if (firstName.trim().length === 0) {
      return toast.error("Ismingizni kiriting");
    }

    if (formattedPhone.length !== 12) {
      return toast.error("Telefon raqam noto'g'ri");
    }

    if (formattedPassword.length < 6) {
      return toast.error("Parol juda ham qisqa");
    }

    setField("isLoading", true);

    authApi
      .register({
        firstName,
        phone: formattedPhone,
        password: formattedPassword,
      })
      .then(({ code, message }) => {
        if (["codeSent", "codeAlreadySent"].includes(code)) {
          toast.success(message);
          return next({ phone, firstName, password });
        }

        throw new Error();
      })
      .catch(({ message, code }) => {
        toast.error(message || "Nimadir xato ketdi");

        if (code === "phoneAlreadyUsed") {
          navigate(
            `/auth/login?phone=${phone}&password=${encodeURIComponent(
              password
            )}`
          );
        }
      })
      .finally(() => setField("isLoading", false));
  };

  return (
    <form onSubmit={handleRegister} className="w-full space-y-3">
      {/* Name */}
      <Input
        required
        size="xl"
        name="name"
        variant="gray"
        value={firstName}
        placeholder="Ismingiz"
        onChange={(value) => setField("firstName", value)}
      />

      {/* Tel */}
      <Input
        required
        size="xl"
        type="tel"
        name="tel"
        value={phone}
        variant="gray"
        placeholder="Telegram raqamingiz"
        onChange={(value) => setField("phone", value)}
      />

      {/* Password */}
      <Input
        required
        size="xl"
        variant="gray"
        name="password"
        type="password"
        value={password}
        placeholder="Parolingiz"
        onChange={(value) => setField("password", value)}
      />

      {/* Submit btn */}
      <Button disabled={isLoading} size="xl" className="w-full">
        Keyingisi{isLoading && "..."}
      </Button>
    </form>
  );
};

const VerifyCodeContent = ({ phone, firstName, password }) => {
  const navigate = useNavigate();
  const { state, setField } = useObjectState({ code: "", isLoading: false });
  const { code, isLoading } = state;

  const handleVerify = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (String(code)?.trim()?.length !== 4) {
      return toast.error("Kod to'g'ri kiritilmadi");
    }

    setField("isLoading", true);

    authApi
      .verify({ phone, code, password, firstName })
      .then(({ token, user, message }) => {
        // Save token to localstorage
        const auth = JSON.stringify({ token, createdAt: Date.now });
        localStorage.setItem("auth", auth);

        // Navigate user
        navigate("/");

        // Notify user
        toast(message || "Hisob muvaffaqiyatli yaratilindi");
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => setField("isLoading", false));
  };

  return (
    <form onSubmit={handleVerify} className="w-full space-y-3">
      {/* Tel */}
      <Input
        required
        size="xl"
        autoFocus
        name="otp"
        type="text"
        value={code}
        maxLength={4}
        minLength={4}
        variant="gray"
        placeholder="_ _ _ _"
        onChange={(value) => setField("code", extractNumbers(value))}
      />

      {/* Submit btn */}
      <Button disabled={isLoading} size="xl" className="w-full">
        Tasdiqlash{isLoading && "..."}
      </Button>

      <p className="text-gray-500">
        Hisobingizni tasdiqlash uchun biz telegramdagi{" "}
        <a
          target="_blank"
          title="IELTS telegram bot"
          className="text-blue-500"
          href="https://t.me/IeltsTestRobot?start=otp"
        >
          @IeltsTestRobot
        </a>{" "}
        botiga kod yubordik
      </p>
    </form>
  );
};

export default Register;
