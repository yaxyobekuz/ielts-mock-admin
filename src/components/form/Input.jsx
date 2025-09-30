import { InputMask } from "@react-input/mask";

const Input = ({
  value,
  onChange,
  name = "",
  size = "md",
  label = "",
  type = "text",
  border = false,
  className = "",
  placeholder = "",
  required = false,
  disabled = false,
  variant = "white",
  ...props
}) => {
  const variantClasses = {
    white: "bg-white",
    gray: "bg-gray-50",
    "gray-md": "bg-gray-100",
  };

  const sizeClasses = {
    sm: "h-8",
    md: "h-9",
    lg: "h-10 px-3.5 rounded-lg",
    xl: "h-11 px-3.5 rounded-xl",
  };

  const defaultClasses = `
  ${
    border ? "border border-gray-300" : "-outline-offset-1"
  } focus:outline-blue-500`;

  const handleChange = (e) => {
    onChange?.(type === "file" ? e.target.files : e.target.value);
  };

  const RenderInput = (() => {
    if (type === "textarea") {
      return (
        <textarea
          id={name}
          {...props}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${variantClasses[variant]} ${defaultClasses}`}
        />
      );
    }

    if (type === "tel") {
      return (
        <InputMask
          id={name}
          type="tel"
          {...props}
          name={name}
          value={value}
          autoComplete="off"
          required={required}
          disabled={disabled}
          onChange={handleChange}
          placeholder={placeholder}
          replacement={{ _: /\d/ }}
          mask="+998 (__) ___-__-__"
          className={`${variantClasses[variant]} ${defaultClasses} ${sizeClasses[size]}`}
        />
      );
    }

    return (
      <input
        id={name}
        {...props}
        type={type}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${variantClasses[variant]} ${defaultClasses} ${sizeClasses[size]}`}
      />
    );
  })();

  return (
    <div className={`text-left space-y-2 ${className}`}>
      {label && (
        <label htmlFor={name} className="ml-1 font-medium text-gray-700">
          {label} {required && <span className="text-blue-500">*</span>}
        </label>
      )}

      {RenderInput}
    </div>
  );
};

export default Input;
