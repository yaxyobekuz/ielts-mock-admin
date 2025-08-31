// Components
import Input from "@/components/form/Input";
import Button from "@/components/form/Button";

const Register = () => {
  return (
    <div className="w-full space-y-3">
      {/* Name */}
      <Input
        required
        size="xl"
        name="name"
        variant="gray"
        placeholder="Ismingiz"
      />

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
        Keyingisi
      </Button>
    </div>
  );
};

export default Register;
