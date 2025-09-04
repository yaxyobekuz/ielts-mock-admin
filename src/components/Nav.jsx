import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Nav = ({
  role,
  onChange,
  activePath,
  links = [],
  className = "",
  extraLinks = [],
  initialStyle = { left: 4, width: 81 },
}) => {
  const linkRefs = useRef([]);
  const location = useLocation();
  const [activeStyle, setActiveStyle] = useState(initialStyle);

  const navLinks = useMemo(() => {
    if (["supervisor", "admin", "owner"].includes(role)) {
      return [...links, ...extraLinks];
    }
    return links;
  }, [role, links, extraLinks]);

  const currentPage = activePath || location.pathname.split("/")[1];

  useEffect(() => {
    const activeIndex = (() => {
      if (!currentPage) return 0;
      return navLinks.findIndex(({ link }) => link === currentPage);
    })();

    if (activeIndex !== -1 && linkRefs.current[activeIndex]) {
      const el = linkRefs.current[activeIndex];

      setActiveStyle({ left: el.offsetLeft - 6, width: el.offsetWidth + 20 });

      setTimeout(() => {
        setActiveStyle({ left: el.offsetLeft + 4, width: el.offsetWidth });
      }, 300);
    }
  }, [location.pathname, navLinks, currentPage]);

  return (
    <nav className={`bg-gray-100 relative rounded-full p-1 ${className}`}>
      {/* Links */}
      <ul className="flex items-center relative">
        {navLinks.map(({ label, link }, index) => (
          <li key={link}>
            <Link
              to={`/${link}`}
              ref={(el) => (linkRefs.current[index] = el)}
              onClick={() => onChange?.(link)}
              className="inline-block relative px-4 py-1.5 rounded-full z-10"
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
