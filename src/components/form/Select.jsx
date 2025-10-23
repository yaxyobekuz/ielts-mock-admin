const Select = ({
  value,
  onChange,
  name = "",
  size = "md",
  label = "",
  options = [],
  border = false,
  className = "",
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
    } focus:outline-blue-500
  `;

  const handleChange = (e) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`text-left space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={name} className="ml-1 font-medium text-gray-700">
          {label} {required && <span className="text-blue-500">*</span>}
        </label>
      )}

      {/* Select */}
      <select
        id={name}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        onChange={handleChange}
        className={`${variantClasses[variant]} ${defaultClasses} ${sizeClasses[size]}`}
        {...props}
      >
        {options.map((opt) =>
          typeof opt === "object" ? (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ) : (
            <option key={opt} value={opt}>
              {opt}
            </option>
          )
        )}
      </select>
    </div>
  );
};

export default Select;
