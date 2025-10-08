// React
import { useEffect } from "react";

// Hooks
import useStore from "@/hooks/useStore";

// Api
import { authApi } from "@/api/auth.api";

// Toast
import { toast } from "@/notification/toast";

// Components
import Input from "@/components/form/Input";
import Button from "@/components/form/Button";

// Hooks
import useObjectState from "@/hooks/useObjectState";

// Router
import { useLocation, useNavigate } from "react-router-dom";

// Helpers
import { extractNumbers, formatUzPhone } from "@/lib/helpers";

const Login = () => {
  const { step, phone, password, setField } = useObjectState({
    step: 1,
    phone: "",
    password: "",
  });

  const handleNext = (data) => {
    setField("step", 2);
    setField("phone", data?.phone);
    setField("password", data?.password);
  };

  // Steps
  if (step === 1) return <LoginContent next={handleNext} />;
  return <VerifyCodeContent phone={phone} password={password} />;
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

    if (formattedPhone.trim().length !== 12) {
      return toast.error("Telefon raqam noto'g'ri");
    }

    if (formattedPassword.trim().length < 6) {
      return toast.error("Parol juda ham qisqa");
    }

    setField("isLoading", true);

    authApi
      .login({ phone: formattedPhone, password: formattedPassword })
      .then(({ code, message, token }) => {
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
      .catch(({ message, code }) => {
        toast(message || "Nimadir xato ketdi", { icon: "☹️" });
        if (code === "accountNotVerified") {
          next({ phone: formattedPhone, password: formattedPassword });
        }
      })
      .finally(() => setField("isLoading", false));
  };

  useEffect(() => {
    if (passwordParam) navigate("/auth/login");
  }, [location.pathname]);

  return (
    <form onSubmit={handleLogin} className="w-full space-y-3">
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
        Kirish{isLoading && "..."}
      </Button>
    </form>
  );
};

const VerifyCodeContent = ({ phone, password }) => {
  const navigate = useNavigate();
  const { updateProperty } = useStore("user");
  const { code, isLoading, setField } = useObjectState({
    code: "",
    isLoading: false,
  });

  // For registration
  const handleVerify = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (String(code)?.trim()?.length !== 4) {
      return toast.error("Kod to'g'ri kiritilmadi");
    }

    setField("isLoading", true);

    authApi
      .verify({ phone, code, password })
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

export default Login;
