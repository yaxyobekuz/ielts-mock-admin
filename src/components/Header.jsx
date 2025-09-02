import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Icons
import { Settings, User } from "lucide-react";

// Images
import ieltsLogo from "@/assets/icons/logo.svg";

// Hooks
import useStore from "@/hooks/useStore";
import usePathSegments from "@/hooks/usePathSegments";

const Header = () => {
  return (
    <header className="sticky top-0 inset-x-0 w-full z-10 bg-white py-2.5">
      <div className="flex items-center justify-between container">
        {/* Logo */}
        <Link to="/">
          <img
            height={32}
            width={95.3}
            src={ieltsLogo}
            alt="IELTS logo svg"
            className="w-[95.3px] h-7"
          />
        </Link>

        {/* Main */}
        <div className="flex items-center gap-3.5">
          {/* Nav */}
          <Nav />

          {/* Settings */}
          <Link
            to="/settings"
            className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200"
          >
            <Settings size={20} strokeWidth={1.5} />
            Sozlamalar
          </Link>

          {/* Profile */}
          <Link
            to="/profile"
            title="Profil"
            aria-label="Profil"
            className="btn size-11 bg-gray-100 p-0 rounded-full hover:bg-gray-200"
          >
            <User size={22} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  );
};

const baseNavLinks = [
  { label: "Asosiy", link: "" },
  { label: "Testlar", link: "tests" },
  { label: "To'lov", link: "payment" },
  { label: "Statistika", link: "statistics" },
  { label: "Ta'riflar", link: "plans" },
];

const Nav = () => {
  const linkRefs = useRef([]);
  const { getProperty } = useStore("user");
  const { pathSegments, location } = usePathSegments();
  const [activeStyle, setActiveStyle] = useState({ left: 4, width: 81 });
  const currentPageLink = pathSegments[0];
  const userRole = getProperty("role");

  const navLinks = useMemo(() => {
    if (["supervisor", "admin", "owner"].includes(userRole)) {
      return [...baseNavLinks, { label: "Ustozlar", link: "teachers" }];
    }
    return baseNavLinks;
  }, [userRole]);

  useEffect(() => {
    const activeIndex = (() => {
      if (!currentPageLink) return 0;
      return navLinks.findIndex(({ link }) => link === currentPageLink);
    })();

    if (activeIndex !== -1 && linkRefs.current[activeIndex]) {
      const el = linkRefs.current[activeIndex];

      setActiveStyle({ left: el.offsetLeft - 6, width: el.offsetWidth + 20 });

      setTimeout(() => {
        setActiveStyle({ left: el.offsetLeft + 4, width: el.offsetWidth });
      }, 300);
    }
  }, [location.pathname, navLinks, currentPageLink]);

  return (
    <nav className="bg-gray-100 relative rounded-full p-1">
      {/* Links */}
      <ul className="flex items-center relative">
        {navLinks.map(({ label, link }, index) => (
          <li key={link}>
            <Link
              to={`/${link}`}
              ref={(el) => (linkRefs.current[index] = el)}
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

export default Header;
