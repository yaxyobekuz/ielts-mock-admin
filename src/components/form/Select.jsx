// UI components
import {
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
  Select as SelectWrapper,
} from "@/components/ui/select";

const Select = ({
  value,
  onChange,
  name = "",
  size = "md",
  label = "",
  options = [],
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
    } focus:outline-blue-500
  `;

  const handleChange = (value) => onChange?.(value);

  return (
    <div className={`text-left space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={name} className="ml-1 font-medium text-gray-700">
          {label} {required && <span className="text-blue-500">*</span>}
        </label>
      )}

      {/* Select */}
      <SelectWrapper
        id={name}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        onValueChange={handleChange}
        {...props}
      >
        <SelectTrigger
          className={`${variantClasses[variant]} ${defaultClasses} ${sizeClasses[size]}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) =>
            typeof opt === "object" ? (
              <SelectItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </SelectItem>
            ) : (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            )
          )}
        </SelectContent>
      </SelectWrapper>
    </div>
  );
};

export default Select;
