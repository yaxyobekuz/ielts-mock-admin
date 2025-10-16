// Icons
import {
  Eye,
  Hash,
  Edit,
  Copy,
  Trash,
  Clock,
  EllipsisVertical,
  MousePointerClick,
  SquareArrowOutUpRight,
} from "lucide-react";

// Router
import { Link } from "react-router-dom";

// Links api
import { linksApi } from "@/api/links.api";

// Toast
import { toast } from "@/notification/toast";

// React
import { useCallback, useEffect } from "react";

// Hooks
import useStore from "@/hooks/useStore";
import useModal from "@/hooks/useModal";
import usePermission from "@/hooks/usePermission";

// Components
import Dropdown from "@/components/Dropdown";
import ProfilePhoto from "@/components/ProfilePhoto";

// Helpers
import { formatDate, formatTime } from "@/lib/helpers";

const Links = () => {
  const { getData, updateProperty } = useStore("links");
  const { isLoading, hasError, data: links } = getData();

  const loadLinks = () => {
    updateProperty("isLoading", true);
    updateProperty("hasError", false);

    linksApi
      .get()
      .then(({ links, code }) => {
        if (code !== "linksFetched") throw new Error();
        updateProperty("data", links);
      })
      .catch(() => updateProperty("hasError", true))
      .finally(() => updateProperty("isLoading", false));
  };

  // Load link
  useEffect(() => {
    isLoading && loadLinks();
  }, []);

  return (
    <div className="container py-8 space-y-6">
      {/* Title */}
      <h1>Havolalar</h1>

      {/* Main */}
      <main>
        {/* Skeleton Loader */}
        {isLoading && !hasError ? (
          <ul className="grid grid-cols-4 gap-5 animate-pulse">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="w-full min-h-52 bg-gray-100 rounded-3xl p-5 space-y-5"
              />
            ))}
          </ul>
        ) : null}

        {/* Error content */}
        {!isLoading && hasError ? <div>Error</div> : null}

        {/* Links */}
        {!isLoading && !hasError && links.length ? (
          <ul className="grid grid-cols-4 gap-5">
            {links.map((link) => (
              <LinkItem key={link?._id} {...link} />
            ))}
          </ul>
        ) : null}
      </main>
    </div>
  );
};

const LinkItem = ({
  title,
  testId,
  _id: id,
  maxUses,
  usedCount,
  createdBy,
  createdAt,
  visitsCount,
}) => {
  const { openModal } = useModal("editLink");
  const { checkPermission } = usePermission();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const { firstName = "Foydalanuvchi", lastName = "", role } = createdBy || {};

  // Permissions
  const canEditLink = checkPermission("canEditLink");
  const canDeleteLink = checkPermission("canDeleteLink");

  const handleCopyLink = useCallback(() => {
    navigator.clipboard
      .writeText(`${siteUrl}/link/${id}`)
      .then(() => toast.success("Havoladan nusxa olindi"))
      .catch(() => toast.error("Havoladan nusxa olishda xatolik"));
  }, [id]);

  const openEditLinkModal = useCallback(() => {
    if (!canEditLink) return;
    openModal({ linkId: id });
  }, [id]);

  const openDeleteLinkModal = useCallback(() => {
    if (!canDeleteLink) return;
    openModal({ linkId: id }, "deleteLink");
  }, [id]);

  return (
    <li className="flex flex-col gap-3.5 justify-between relative w-full min-h-52 bg-gray-100 rounded-3xl p-5 transition-all duration-200 hover:bg-gray-50">
      {/* Profile */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-3.5">
          <ProfilePhoto user={createdBy} />

          <div>
            <h3 className="text-xl font-medium line-clamp-1">{title}</h3>
            <p className="text-sm line-clamp-1">
              <span className="text-gray-500 capitalize">{role} • </span>
              <span className="text-blue-500">{`${firstName} ${lastName}`}</span>
            </p>
          </div>
        </div>

        {/* Menu */}
        <Dropdown
          title="Sozlamalar"
          aria-label="Sozlamalar"
          menu={{
            items: [
              {
                disabled: !canEditLink,
                children: "Tahrirlash",
                action: openEditLinkModal,
                icon: <Edit size={18} strokeWidth={1.5} />,
              },
              {
                action: handleCopyLink,
                children: "Havoladan nusxa olish",
                icon: <Copy size={18} strokeWidth={1.5} />,
              },
              {
                variant: "danger",
                children: "O'chirish",
                disabled: !canDeleteLink,
                action: openDeleteLinkModal,
                icon: <Trash size={18} strokeWidth={1.5} />,
              },
            ],
          }}
          className="flex items-center justify-center relative shrink-0 z-10 size-10 bg-white rounded-full"
        >
          <EllipsisVertical size={20} />
        </Dropdown>
      </div>

      {/* Mid */}
      <div className="space-y-1.5">
        {/* Max uses */}
        <div className="flex items-center gap-1.5">
          <Hash strokeWidth={1.5} size={18} />
          <p className="text-[15px]">
            <span>Max foydalanish: </span>
            <span className="text-blue-500">{maxUses} ta</span>
          </p>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5">
          <Clock strokeWidth={1.5} size={18} />
          <p className="text-[15px]">
            <span>{formatDate(createdAt)} </span>
            <span className="text-gray-500">{formatTime(createdAt)}</span>
          </p>
        </div>
      </div>

      {/* Links */}
      <div className="flex items-center gap-3.5">
        {/* Test */}
        <Link
          to={`/tests/${testId}`}
          className="flex items-center justify-center gap-1.5 relative z-10 text-gray-500 hover:text-blue-500"
        >
          <SquareArrowOutUpRight
            size={18}
            strokeWidth={1.5}
            className="transition-colors duration-200"
          />
          <span className="transition-colors duration">Test</span>
        </Link>

        {/* Visits */}
        <p
          title="Ko'rishlar soni"
          aria-label="Ko'rishlar soni"
          className="flex items-center justify-center gap-1.5 relative z-10 text-gray-500"
        >
          <Eye size={18} strokeWidth={1.5} />
          <span>{visitsCount} ta</span>
        </p>

        {/* Uses */}
        <p
          title="Ishlatishlar soni"
          aria-label="Ishlatishlar soni"
          className="flex items-center justify-center gap-1.5 relative z-10 text-gray-500"
        >
          <MousePointerClick size={18} strokeWidth={1.5} />
          <span>{usedCount} ta</span>
        </p>
      </div>

      {/* Link */}
      <Link
        to={`/links/${id}`}
        className="block absolute z-0 inset-0 size-full rounded-3xl"
      />
    </li>
  );
};

export default Links;
