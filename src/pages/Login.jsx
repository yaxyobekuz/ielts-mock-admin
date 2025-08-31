// Components
import Input from "@/components/form/Input";
import Button from "@/components/form/Button";

const Login = () => {
  return (
    <div className="w-full space-y-3">
      {/* Tel */}
      <Input
        required
        size="xl"
        type="tel"
        name="tel"
        variant="gray"
        placeholder="Telegram raqamingiz"
      />

      {/* Password */}
      <Input
        required
        size="xl"
        variant="gray"
        name="password"
        type="password"
        placeholder="Parolingiz"
      />

      {/* Submit btn */}
      <Button size="xl" className="w-full">
        Kirish
      </Button>
    </div>
  );
};

export default Login;
