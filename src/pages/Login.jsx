import { useLocation, useNavigate, useParams } from "react-router-dom";

// Api
import { authApi } from "@/api/auth.api";

// Toast
import { toast } from "@/notification/toast";

// Components
import Input from "@/components/form/Input";
import Button from "@/components/form/Button";

// Helpers
import { extractNumbers } from "@/lib/helpers";

// Hooks
import useObjectState from "@/hooks/useObjectState";
import { useEffect } from "react";

const Login = () => {
  const { state, setField } = useObjectState({ step: 1, phone: "" });
  const { step, phone } = state;

  const handleNext = (data) => {
    setField("step", 2);
    setField("phone", data?.phone);
  };

  // Steps
  if (step === 1) return <LoginContent next={handleNext} />;
  return <VerifyCodeContent phone={phone} />;
};

const LoginContent = ({ next }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const passwordParam = params.get("password") || "";
  const phoneParam = extractNumbers(params.get("phone")) || "";

  const { state, setField } = useObjectState({
    isLoading: false,
    phone: phoneParam,
    password: passwordParam,
  });

  const { phone, password, isLoading } = state;

  const handleLogin = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (phone.trim().length !== 12) {
      return toast.error("Telefon raqam noto'g'ri");
    }

    if (password.trim().length < 6) {
      return toast.error("Parol juda ham qisqa");
    }

    setField("isLoading", true);

    authApi
      .login({ phone, password })
      .then(({ code, message, token, user }) => {
        if (code === "loginSuccess") {
          // Navigate user
          navigate("/");

          // Notify user
          toast.success(message || "Hisobingizga kirdingiz");

          // Save token to localstorage
          const auth = JSON.stringify({ token, createdAt: Date.now });
          return localStorage.setItem("auth", auth);
        }

        throw new Error();
      })
      .catch(({ message, code }) => {
        toast.error(message || "Nimadir xato ketdi");
        if (code === "accountNotVerified") next({ phone });
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
        onChange={(value) => setField("phone", extractNumbers(value))}
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
      <Button size="xl" className="w-full">
        Kirish
      </Button>
    </form>
  );
};

const VerifyCodeContent = ({ phone }) => {
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
      <Button size="xl" className="w-full">
        Tasdiqlash
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
