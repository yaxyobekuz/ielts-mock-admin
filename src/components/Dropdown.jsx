// UI components
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dropdown = ({
  children,
  align = "end",
  className = "",
  menu = {
    className: "",
    items: [
      {
        icon: null,
        className: "",
        disabled: false,
        action: () => {},
        children: "Item 1",
        variant: "default",
      },
    ],
  },
  ...props
}) => {
  const variants = {
    default: "",
    danger:
      "text-red-500 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600",
  };
  return (
    <DropdownMenu>
      {/* Trigger */}
      <DropdownMenuTrigger asChild>
        <button className={className} {...props}>
          {children}
        </button>
      </DropdownMenuTrigger>

      {/* Content */}
      <DropdownMenuContent className={menu.className || "w-56"} align={align}>
        {menu.items?.map(
          (
            {
              icon,
              action,
              children,
              disabled,
              className,
              variant = "default",
            },
            index
          ) => {
            return (
              <DropdownMenuItem
                key={index}
                disabled={disabled}
                onClick={!disabled && action ? action : null}
                className={`gap-2.5 cursor-pointer ${className} ${variants[variant]}`}
              >
                {icon}
                {children}
              </DropdownMenuItem>
            );
          }
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
