// Api
import { authApi } from "@/api/auth.api";

// React
import { useEffect, useMemo } from "react";

// Icons
import { ChevronLeft } from "lucide-react";

// Toast
import { toast } from "@/notification/toast";

// Components
import Input from "@/components/form/Input";
import Button from "@/components/form/Button";

// Router
import { useNavigate } from "react-router-dom";

// Hooks
import useObjectState from "@/hooks/useObjectState";

// Helpers
import { extractNumbers, getRemainingSeconds } from "@/lib/helpers";

const Register = () => {
  const { state, step, setField } = useObjectState({
    step: 1,
    phone: "",
    password: "",
  });

  const handleNext = ({ phone, password, createdAt }) => {
    setField("step", 2);
    setField("phone", phone);
    setField("password", password);
    setField("createdAt", createdAt);
  };

  // Steps
  if (step === 1) return <RegisterContent next={handleNext} />;
  return <VerifyCodeContent {...state} onBack={() => setField("step", 1)} />;
};

const RegisterContent = ({ next }) => {
  const navigate = useNavigate();
  const { phone, password, firstName, isLoading, setField } = useObjectState({
    phone: "",
    password: "",
    firstName: "",
    isLoading: false,
  });

  const handleRegister = (e) => {
    e.preventDefault();
    if (isLoading) return;

    const formattedPassword = password?.trim() || "";
    const formattedPhone = extractNumbers(phone)?.trim() || "";

    if (!firstName?.trim().length) {
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
      .then(({ code, message, createdAt }) => {
        if (["codeSent", "codeAlreadySent"].includes(code)) {
          toast.success(message);
          return next({
            createdAt,
            phone: formattedPhone,
            password: formattedPassword,
          });
        }

        throw new Error();
      })
      .catch(({ message, code }) => {
        toast.error(message || "Nimadir xato ketdi");

        if (code === "phoneAlreadyUsed") {
          navigate(
            `/auth/login?phone=${phone}&password=${encodeURIComponent(
              formattedPassword
            )}`
          );
        }
      })
      .finally(() => setField("isLoading", false));
  };

  return (
    <form onSubmit={handleRegister} className="w-full">
      {/* Name */}
      <Input
        required
        size="xl"
        label="Ism"
        minLength={1}
        maxLength={32}
        variant="gray"
        name="firstName"
        className="mb-3"
        value={firstName}
        placeholder="Teshavoy"
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
        className="mb-3"
        label="Telegram raqam"
        placeholder="+998 (__) ___-__-__"
        onChange={(value) => setField("phone", value)}
      />

      {/* Password */}
      <Input
        required
        size="xl"
        label="Parol"
        minLength={6}
        variant="gray"
        maxLength={32}
        name="password"
        type="password"
        value={password}
        className="mb-5"
        placeholder="Kamida 6ta belgi"
        onChange={(value) => setField("password", value)}
      />

      {/* Submit btn */}
      <Button disabled={isLoading} size="xl" className="w-full">
        Keyingisi{isLoading && "..."}
      </Button>
    </form>
  );
};

const VerifyCodeContent = ({ phone, password, createdAt, onBack }) => {
  const navigate = useNavigate();
  const initialCooldownTime = useMemo(() => {
    return getRemainingSeconds(createdAt) || 0;
  }, [createdAt]);

  const { code, isLoading, isResending, cooldownTime, canResend, setField } =
    useObjectState({
      code: "",
      isLoading: false,
      isResending: false,
      cooldownTime: initialCooldownTime,
      canResend: initialCooldownTime === 0,
    });

  const handleVerify = (e) => {
    e.preventDefault();
    if (isLoading) return;

    const formattedCode = extractNumbers(code)?.trim() || "";
    const formattedPhone = extractNumbers(phone)?.trim() || "";

    if (formattedPhone.length !== 12) {
      return toast.error("Telefon raqam noto'g'ri");
    }

    if (formattedCode.trim()?.length !== 4) {
      return toast.error("Kod to'g'ri kiritilmadi");
    }

    setField("isLoading", true);

    authApi
      .verify({ phone: formattedPhone, code: formattedCode, password })
      .then(({ token, message }) => {
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

  const handleResendCode = () => {
    if (isResending || !canResend) return;
    const formattedPhone = extractNumbers(phone)?.trim() || "";

    if (formattedPhone.length !== 12) {
      return toast.error("Telefon raqam noto'g'ri");
    }

    setField("isResending", true);

    authApi
      .resendCode({ phone: formattedPhone })
      .then(({ message, createdAt }) => {
        toast.success(message || "Kod qayta yuborildi");
        const remainingSeconds = getRemainingSeconds(createdAt);
        setField("cooldownTime", remainingSeconds);
      })
      .catch(({ message, code, createdAt }) => {
        if (code === "codeAlreadySent") {
          const remainingSeconds = getRemainingSeconds(createdAt);
          setField("cooldownTime", remainingSeconds);
        }

        toast.error(message || "Kod yuborishda xatolik");
      })
      .finally(() => setField("isResending", false));
  };

  // Timer effect for cooldown
  useEffect(() => {
    let interval;

    if (cooldownTime > 0) {
      setField("canResend", false);

      interval = setInterval(() => {
        let newTime = 0;
        if (cooldownTime <= 1) setField("canResend", true);
        else newTime = cooldownTime - 1;

        setField("cooldownTime", newTime);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [cooldownTime, canResend]);

  return (
    <div className="">
      {/* Top */}
      <div className="flex items-center justify-between mb-3.5">
        {/* Back button */}
        <button
          onClick={onBack}
          className="btn h-8 p-0 text-sm font-medium text-gray-500 hover:text-inherit"
        >
          <ChevronLeft size={20} className="-translate-x-0.5" />
          Ortga qaytish
        </button>

        {/* Resend code button */}
        <button
          onClick={handleResendCode}
          disabled={isResending || !canResend}
          className="btn h-8 p-0 text-sm font-medium hover:text-blue-500 disabled:opacity-50 disabled:hover:text-inherit"
        >
          {isResending && "Kod yuborilmoqda..."}

          {!isResending &&
            !canResend &&
            `Kodni qayta yuborish (${cooldownTime}s)`}

          {!isResending && canResend && "Kodni qayta yuborish"}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleVerify} className="w-full">
        {/* Tel */}
        <Input
          required
          size="xl"
          autoFocus
          name="otp"
          type="text"
          label="Kod"
          value={code}
          maxLength={4}
          minLength={4}
          variant="gray"
          className="mb-5"
          placeholder="_ _ _ _"
          onChange={(value) => setField("code", extractNumbers(value))}
        />

        {/* Submit btn */}
        <Button disabled={isLoading} size="xl" className="w-full mb-3">
          Tasdiqlash{isLoading && "..."}
        </Button>

        {/* Info */}
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
    </div>
  );
};

export default Register;
