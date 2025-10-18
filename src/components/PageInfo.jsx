// Lottie
import Lottie from "lottie-react";

// Router
import { Link } from "react-router-dom";

// Animated
import duckShrugging from "@/assets/animated/duck-shrugging.json";

const PageInfo = ({
  description = "",
  title = "Sarlavha",
  className = "w-full",
  allowFullScreen = false,
  animation = duckShrugging,
  links = { primary: null, secondary: null },
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        allowFullScreen ? "w-full h-screen" : ""
      } ${className}`}
    >
      {/* Icon */}
      <Lottie animationData={animation} className="size-36 mb-5" />

      {/* Title */}
      <strong className="max-w-md text-2xl font-semibold">{title}</strong>

      {/* Description */}
      {description && (
        <p className="max-w-md text-gray-600 text-[17px] mt-3">{description}</p>
      )}

      {/* Links */}
      {links.secondary || links.primary ? (
        <div className="flex items-center gap-5 mt-8">
          {/* Secondary */}
          {links.secondary && (
            <Link
              to={links.secondary.to}
              className="btn h-10 px-5 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              {links.secondary.body}
            </Link>
          )}

          {/* Primary */}
          {links.primary && (
            <Link
              to={links.primary.to}
              className="btn h-10 px-5 bg-blue-500 rounded-xl text-white hover:bg-blue-600"
            >
              {links.primary.body}
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default PageInfo;
