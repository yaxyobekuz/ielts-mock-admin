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
        children: "Item 1",
        disabled: false,
        action: () => {},
      },
    ],
  },
  ...props
}) => {
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
          ({ children, action, className, icon, disabled }, index) => {
            return (
              <DropdownMenuItem
                key={index}
                disabled={disabled}
                onClick={!disabled && action ? action : null}
                className={`gap-2.5 cursor-pointer ${className}`}
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
