// React
import { useMemo } from "react";

// Router
import { Link } from "react-router-dom";

// Hooks
import useModal from "@/hooks/useModal";
import useStore from "@/hooks/useStore";

// Icons
import { Settings } from "lucide-react";

// Componetns
import Nav from "./Nav";
import ProfilePhoto from "./ProfilePhoto";

// Images
import ieltsLogo from "@/assets/icons/logo.svg";

// Data
import { getNavlinksByRole } from "@/data/navlinks";

const Header = () => {
  const { getProperty } = useStore("user");
  const { role } = getProperty("data");
  const { openModal } = useModal("profile");
  const handleOpenProfileModal = () => openModal();
  const navlinks = useMemo(() => getNavlinksByRole(role), [role]);

  return (
    <header className="sticky top-0 inset-x-0 w-full z-20 bg-white py-2.5">
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
          <Nav links={navlinks} />

          {/* Settings */}
          <Link
            to="/settings"
            className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200"
          >
            <Settings size={20} strokeWidth={1.5} />
            Sozlamalar
          </Link>

          {/* Profile */}
          <button
            title="Profil"
            aria-label="Profil"
            onClick={handleOpenProfileModal}
            className="btn size-11 bg-gray-100 p-0 rounded-full hover:bg-gray-200"
          >
            <ProfilePhoto size={44} className="size-11 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
