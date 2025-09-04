import { Link } from "react-router-dom";

// Components
import Nav from "./Nav";

// Hooks
import useStore from "@/hooks/useStore";

// Icons
import { Settings, User } from "lucide-react";

// Images
import ieltsLogo from "@/assets/icons/logo.svg";

const Header = () => {
  const { getProperty } = useStore("user");
  const role = getProperty("role");

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
          <Nav
            role={role}
            links={[
              { label: "Asosiy", link: "" },
              { label: "Testlar", link: "tests" },
              { label: "To'lov", link: "payment" },
              { label: "Statistika", link: "statistics" },
              { label: "Ta'riflar", link: "plans" },
            ]}
            extraLinks={[{ label: "Ustozlar", link: "teachers" }]}
          />

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

export default Header;
