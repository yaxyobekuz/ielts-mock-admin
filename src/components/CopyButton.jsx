// React
import { useState } from "react";

// Toast
import { toast } from "@/notification/toast";
import { Check, Copy } from "lucide-react";

const CopyButton = ({
  text,
  icon = null,
  className = "",
  children = null,
  disabled = false,
  disabledDelay = 1500,
  notificationText = "Nusxa olindi",
}) => {
  const iconProps = icon || {};
  const [isDisabled, setIsDisabled] = useState(false);

  const handleCopy = () => {
    setIsDisabled(true);

    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(notificationText))
      .catch(() => toast.error("Nusxa olishda xatolik"));

    setTimeout(() => setIsDisabled(false), disabledDelay);
  };

  return (
    <button
      onClick={handleCopy}
      className={className}
      disabled={disabled || isDisabled}
    >
      {icon && (
        <span>
          {isDisabled ? <Check {...iconProps} /> : <Copy {...iconProps}  className=""/>}
        </span>
      )}
      {children}
    </button>
  );
};

export default CopyButton;
