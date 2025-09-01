// Icons
import { RefreshCcw } from "lucide-react";

// Images
import ieltsLogo from "@/assets/icons/logo.svg";

const MainBgLoader = ({ hasError, onButtonClick = () => {} }) => {
  if (hasError) {
    return (
      <span className="flex flex-col items-center justify-center gap-3.5 fixed inset-0 z-50 size-full bg-white animate__animated animate__jello">
        <button
          onClick={onButtonClick}
          className="btn size-14 bg-gray-100 rounded-full p-0"
        >
          <RefreshCcw size={24} color="blue" strokeWidth={1.5} />
        </button>
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3.5 fixed inset-0 z-50 size-full bg-white animate__animated animate__jello">
      <img
        height={40}
        width={122.5}
        src={ieltsLogo}
        alt="IELTS logo svg"
        className="w-[122.5px] h-9"
      />

      <div className="bar-loader w-28 h-1 mr-1.5" />
    </div>
  );
};

export default MainBgLoader;
