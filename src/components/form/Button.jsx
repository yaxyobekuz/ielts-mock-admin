const Button = ({
  onClick,
  children,
  size = "md",
  className = "",
  variant = "primary",
  ...props
}) => {
  const variants = {
    neutral: "bg-gray-100 hover:bg-gray-200 disabled:!bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:!bg-red-500",
    primary: "bg-blue-500 text-white hover:bg-blue-600 disabled:!bg-blue-500",
    lightBlue: `bg-blue-100 text-blue-500 hover:bg-blue-200 disabled:!bg-blue-100`,
  };

  const sizeClasses = {
    none: "",
    sm: "h-8 px-4 rounded-md",
    md: "h-9 px-5 rounded-lg",
    lg: "h-10 px-5 rounded-lg",
    xl: "h-11 px-5 rounded-xl",
  };

  return (
    <button
      {...props}
      onClick={onClick}
      children={children}
      className={`flex items-center justify-center ${variants[variant]} ${sizeClasses[size]} ${className} transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed`}
    />
  );
};

export default Button;
