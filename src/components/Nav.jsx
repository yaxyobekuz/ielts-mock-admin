// Router
import { Link } from "react-router-dom";

// Hooks
import usePathSegments from "@/hooks/usePathSegments";

// React
import { useEffect, useMemo, useRef, useState } from "react";

const Nav = ({
  role,
  onChange,
  links = [],
  activeIndex,
  className = "",
  extraLinks = [],
  pagePathIndex = 0,
  fullSizeBtn = false,
  initialStyle = { left: 4, width: 81 },
}) => {
  const linkRefs = useRef([]);
  const { pathSegments, location } = usePathSegments();
  const [activeStyle, setActiveStyle] = useState(initialStyle);

  const currentPage = pathSegments[pagePathIndex];

  const navLinks = useMemo(() => {
    if (["supervisor", "admin", "owner"].includes(role)) {
      return [...links, ...extraLinks];
    }
    return links;
  }, [role, links, extraLinks]);

  useEffect(() => {
    const activeIdx = (() => {
      if (typeof activeIndex === "number") {
        return activeIndex;
      }

      if (!currentPage) return 0;
      return navLinks.findIndex(({ link }) => {
        const pathSegments = link.split("/").filter(Boolean) || [];
        return pathSegments[pagePathIndex] === currentPage;
      });
    })();

    if (activeIdx !== -1 && linkRefs.current[activeIdx]) {
      const el = linkRefs.current[activeIdx];

      setActiveStyle({ left: el.offsetLeft - 6, width: el.offsetWidth + 20 });

      setTimeout(() => {
        setActiveStyle({ left: el.offsetLeft + 4, width: el.offsetWidth });
      }, 300);
    }
  }, [location.pathname, navLinks.length, currentPage, activeIndex]);

  return (
    <nav className={`bg-gray-100 relative rounded-full p-1 ${className}`}>
      {/* Links */}
      <ul className="flex items-center relative">
        {navLinks.map(({ label, link }, index) => (
          <li key={link} className={`${fullSizeBtn ? "w-full" : ""}`}>
            <Link
              to={`/${link}`}
              ref={(el) => (linkRefs.current[index] = el)}
              onClick={() => onChange?.(link)}
              className="inline-block relative px-4 py-1.5 rounded-full z-10 w-full text-center"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Overlay */}
      <span
        style={{ left: activeStyle.left, width: activeStyle.width }}
        className="absolute inset-y-1 bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out"
      />
    </nav>
  );
};

export default Nav;
