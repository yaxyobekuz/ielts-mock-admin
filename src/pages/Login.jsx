// Helpers
import {
  formatUzPhone,
  extractNumbers,
  getRemainingSeconds,
} from "@/lib/helpers";

// Hooks
import useStore from "@/hooks/useStore";

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

// Hooks
import useObjectState from "@/hooks/useObjectState";

// Router
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const { step, state, setField } = useObjectState({ step: "login" });

  const handleNext = ({ phone, password, createdAt, step = "verify" }) => {
    setField("step", step);
    setField("phone", phone);
    setField("password", password);
    setField("createdAt", createdAt);
  };

  const handleBack = () => {
    setField("phone", "");
    setField("password", "");
    setField("createdAt", "");
    setField("step", "login");
  };

  // Steps
  if (step === "login") return <LoginContent next={handleNext} />;
  else if (step === "forgot") return <LoginWithCode onBack={handleBack} />;
  return <VerifyCodeContent {...state} onBack={handleBack} />;
};

const LoginContent = ({ next }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const passwordParam = params.get("password")?.trim() || "";
  const phoneParam = formatUzPhone(extractNumbers(params.get("phone")) || "");

  const { phone, password, isLoading, setField } = useObjectState({
    isLoading: false,
    phone: phoneParam,
    password: passwordParam,
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (isLoading) return;

    const formattedPassword = password?.trim() || "";
    const formattedPhone = extractNumbers(phone)?.trim() || "";

    if (formattedPhone.length !== 12) {
      return toast.error("Telefon raqam noto'g'ri");
    }

    if (formattedPassword.trim().length < 6) {
      return toast.error("Parol juda ham qisqa");
    }

    setField("isLoading", true);

    authApi
      .login({ phone: formattedPhone, password: formattedPassword })
      .then(({ code, message, token, user }) => {
        if (code !== "loginSuccess") throw new Error();

        if (!["supervisor", "teacher"].includes(user.role)) {
          navigate("/auth/login");
          return toast.error("Kirish uchun huquqlaringiz yetarli emas");
        }

        // Navigate user
        navigate("/");

        // Notify user
        toast.success(message || "Hisobingizga kirdingiz");

        // Save token to localstorage
        const auth = JSON.stringify({ token, createdAt: Date.now });
        return localStorage.setItem("auth", auth);
      })
      .catch(({ message, code, createdAt }) => {
        toast(message || "Nimadir xato ketdi", { icon: "☹️" });
        if (code === "accountNotVerified") {
          next({
            createdAt,
            phone: formattedPhone,
            password: formattedPassword,
          });
        }
      })
      .finally(() => setField("isLoading", false));
  };

  useEffect(() => {
    if (passwordParam) navigate("/auth/login");
  }, [location.pathname]);

  return (
    <form onSubmit={handleLogin} className="w-full">
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
        placeholder="Kamida 6ta belgi"
        onChange={(value) => setField("password", value)}
      />

      {/* Forgot password */}
      <div className="flex items-center justify-end w-full font-medium text-sm">
        <span className="text-gray-500">Parolni unutdingizmi?</span>
        <button
          type="button"
          onClick={() => next({ step: "forgot" })}
          className="btn h-auto px-1.5 py-5 text-blue-500 hover:text-blue-600"
        >
          Kod orqali kirish
        </button>
      </div>

      {/* Submit btn */}
      <Button disabled={isLoading} size="xl" className="w-full">
        Kirish{isLoading && "..."}
      </Button>
    </form>
  );
};

const VerifyCodeContent = ({ phone, password, createdAt, onBack }) => {
  const navigate = useNavigate();
  const { updateProperty } = useStore("user");

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

    if (formattedCode.length !== 4) {
      return toast.error("Kod to'g'ri kiritilmadi");
    }

    setField("isLoading", true);

    authApi
      .verify({ phone: formattedPhone, code: formattedCode, password })
      .then(({ token, user, message }) => {
        if (!["supervisor", "teacher"].includes(user.role)) {
          navigate("/auth/login");
          return toast.error("Kirish uchun huquqlaringiz yetarli emas");
        }

        // Navigate user
        navigate("/");

        // Save user data to store
        updateProperty("data", user);

        // Notify user
        toast(message || "Hisobingizga kirdingiz");

        // Save token to localstorage
        const auth = JSON.stringify({ token, createdAt: Date.now });
        localStorage.setItem("auth", auth);
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

const LoginWithCode = ({ onBack }) => {
  const navigate = useNavigate();
  const { updateProperty } = useStore("user");

  const {
    code,
    phone,
    codeSent,
    setField,
    canResend,
    isSending,
    isLoading,
    isResending,
    cooldownTime,
  } = useObjectState({
    code: "",
    phone: "",
    codeSent: false,
    cooldownTime: 0,
    canResend: true,
    isLoading: false,
    isSending: false,
    isResending: false,
  });

  const handleVerify = (e) => {
    e.preventDefault();
    if (isLoading) return;

    const formattedCode = extractNumbers(code)?.trim() || "";
    const formattedPhone = extractNumbers(phone)?.trim() || "";

    if (formattedCode.length !== 4) {
      return toast.error("Kod to'g'ri kiritilmadi");
    }

    if (formattedPhone.length !== 12) {
      return toast.error("Telefon raqam noto'g'ri");
    }

    setField("isLoading", true);

    authApi
      .loginWithCode({ phone: formattedPhone, code: formattedCode })
      .then(({ token, user, message }) => {
        if (!["supervisor", "teacher"].includes(user.role)) {
          navigate("/auth/login");
          return toast.error("Kirish uchun huquqlaringiz yetarli emas");
        }

        // Navigate user
        navigate("/");

        // Save user data to store
        updateProperty("data", user);

        // Notify user
        toast(message || "Hisobingizga kirdingiz");

        // Save token to localstorage
        const auth = JSON.stringify({ token, createdAt: Date.now });
        localStorage.setItem("auth", auth);
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => setField("isLoading", false));
  };

  const handleSetPhone = (e) => {
    e.preventDefault();
    if (isSending) return;

    const formattedPhone = extractNumbers(phone)?.trim() || "";

    if (formattedPhone.length !== 12) {
      return toast.error("Telefon raqam noto'g'ri");
    }

    setField("isSending", true);

    authApi
      .sendCodeToPhone({ phone: formattedPhone })
      .then(({ createdAt, message }) => {
        setField("codeSent", true);
        toast.success(message || "Kod yuborildi");

        const remainingSeconds = getRemainingSeconds(createdAt);
        setField("cooldownTime", remainingSeconds);
      })
      .catch(({ message, code, createdAt }) => {
        if (code === "codeAlreadySent") {
          setField("codeSent", true);

          const remainingSeconds = getRemainingSeconds(createdAt);
          setField("cooldownTime", remainingSeconds);
        }

        toast.error(message || "Kod yuborishda xatolik");
      })
      .finally(() => setField("isSending", false));
  };

  const handleResendCode = () => {
    if (isResending || !canResend) return;

    const formattedPhone = extractNumbers(phone)?.trim() || "";

    if (formattedPhone.length !== 12) {
      return toast.error("Telefon raqam noto'g'ri");
    }

    setField("isResending", true);

    authApi
      .resendCode({ phone: formattedPhone }, true)
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

  const handleBack = () => {
    setField("code", "");
    setField("codeSent", false);
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
    <div>
      {/* Top */}
      <div className="flex items-center justify-between mb-3.5">
        {/* Back button */}
        <button
          onClick={codeSent ? handleBack : onBack}
          className="btn h-8 p-0 text-sm font-medium text-gray-500 hover:text-inherit"
        >
          <ChevronLeft size={20} className="-translate-x-0.5" />
          Ortga qaytish
        </button>

        {/* Resend code button */}
        {codeSent && (
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
        )}
      </div>

      {/* Send code form */}
      {!codeSent && (
        <form onSubmit={handleSetPhone} className="w-full">
          {/* Tel */}
          <Input
            required
            size="xl"
            type="tel"
            name="tel"
            value={phone}
            variant="gray"
            className="mb-5"
            label="Telegram raqam"
            placeholder="+998 (__) ___-__-__"
            onChange={(value) => setField("phone", value)}
          />

          {/* Next btn */}
          <Button disabled={isSending} size="xl" className="w-full">
            Keyingisi{isSending && "..."}
          </Button>
        </form>
      )}

      {/* Verify code  */}
      {codeSent && (
        <form onSubmit={handleVerify} className="w-full">
          {/* Otp */}
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
            Kirish{isLoading && "..."}
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
      )}
    </div>
  );
};

export default Login;
