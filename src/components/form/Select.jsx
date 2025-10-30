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
  label = "",
  size = "md",
  error = null,
  options = [],
  border = false,
  className = "",
  placeholder = "",
  required = false,
  disabled = false,
  isLoading = false,
  variant = "white",
  onOpenChange = () => {},
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
    <div className={`text-left space-y-2 ${label ? className : ""}`}>
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
        onOpenChange={onOpenChange}
        onValueChange={handleChange}
        {...props}
      >
        <SelectTrigger
          className={`${variantClasses[variant]} ${defaultClasses} ${
            sizeClasses[size]
          } ${!label ? className : ""}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {/* Options */}
          {!isLoading &&
            options.map((opt) =>
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

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center h-20">
              <div className="spin-loader size-5" />
            </div>
          )}
        </SelectContent>
      </SelectWrapper>
    </div>
  );
};

export default Select;
