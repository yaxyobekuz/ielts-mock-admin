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

// Links api
import { linksApi } from "@/api/links.api";

// Toast
import { toast } from "@/notification/toast";

// React
import { useCallback, useEffect } from "react";

// Hooks
import useModal from "@/hooks/useModal";
import PageInfo from "@/components/PageInfo";
import useArrayStore from "@/hooks/useArrayStore";
import usePermission from "@/hooks/usePermission";

// Components
import Dropdown from "@/components/Dropdown";
import Pagination from "@/components/Pagination";
import ProfilePhoto from "@/components/ProfilePhoto";

// Helpers
import { formatDate, formatTime } from "@/lib/helpers";

// Router
import { Link, useSearchParams } from "react-router-dom";

const Links = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const {
    setPage,
    initialize,
    getMetadata,
    getPageData,
    hasCollection,
    setPageErrorState,
    setPageLoadingState,
  } = useArrayStore("links");

  // Initialize collection on mount
  useEffect(() => {
    if (!hasCollection()) initialize(true); // pagination = true
  }, [hasCollection, initialize]);

  const metadata = getMetadata();
  const pageData = getPageData(currentPage);

  const links = pageData?.data || [];
  const hasError = pageData?.error || null;
  const isLoading = pageData?.isLoading || false;
  const hasNextPage = pageData?.hasNextPage ?? false;
  const hasPrevPage = pageData?.hasPrevPage ?? false;

  // Load links for current page
  const loadLinks = useCallback(
    (page) => {
      setPageLoadingState(page, true);

      linksApi
        .get({ page, limit: 12 })
        .then(({ links, code, pagination }) => {
          if (code !== "linksFetched") throw new Error("Failed to fetch links");

          setPage(page, links, null, pagination);
        })
        .catch((error) => {
          const errorMessage =
            error?.message || "Ma'lumotlarni yuklashda xatolik";
          setPageErrorState(page, errorMessage);
          toast.error("Havolalarni yuklashda xatolik yuz berdi");
        });
    },
    [setPageLoadingState, setPage, setPageErrorState]
  );

  // Navigate to page
  const goToPage = useCallback(
    (page) => {
      if (page < 1) return;
      setSearchParams({ page: page.toString() });
    },
    [setSearchParams]
  );

  // Load links when page changes
  useEffect(() => {
    const pageDataExists = getPageData(currentPage);
    if (!pageDataExists) loadLinks(currentPage);
  }, [currentPage, loadLinks, getPageData]);

  return (
    <div className="container py-8 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1>Havolalar</h1>

        {/* Pagination Info */}
        {!isLoading && !hasError && links.length > 0 && metadata && (
          <div className="flex items-center gap-3 text-gray-500">
            <span>
              Hozirgi sahifa:{" "}
              <strong className="font-medium text-black">
                {metadata.currentPage}
              </strong>{" "}
              / {metadata.totalPages}
            </span>

            <span className="size-1 bg-gray-400 rounded-full" />

            <span>
              Jami havolalar:{" "}
              <strong className="font-medium text-black">
                {metadata.total}
              </strong>{" "}
              ta
            </span>
          </div>
        )}
      </div>

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
        {!isLoading && hasError ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-red-500 text-lg">{hasError}</p>
            <button
              onClick={() => loadLinks(currentPage)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Qayta urinib ko'rish
            </button>
          </div>
        ) : null}

        {/* No links */}
        {!isLoading && !hasError && links.length === 0 ? (
          <PageInfo
            className="pt-12"
            title="Hech qanday havola topilmadi"
            links={{ primary: { to: "/links", body: "1-sahifaga qaytish" } }}
            description={`Ushbu ${currentPage}-sahifada hech qanday havola topilmadi.`}
          />
        ) : null}

        {/* Links */}
        {!isLoading && !hasError && links.length > 0 ? (
          <ul className="grid grid-cols-4 gap-5">
            {links.map((link) => (
              <LinkItem {...link} key={link?._id} />
            ))}
          </ul>
        ) : null}
      </main>

      {/* Pagination Controls */}
      {!isLoading && !hasError && links.length > 0 && (
        <Pagination
          className="pt-4"
          maxPageButtons={5}
          showPageNumbers={true}
          onPageChange={goToPage}
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          totalPages={metadata?.totalPages || 1}
        />
      )}
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
  requireComment,
}) => {
  const { openModal } = useModal("editLink");
  const { checkPermission } = usePermission();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const { firstName = "Foydalanuvchi", lastName = "" } = createdBy || {};

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
    openModal({ linkId: id, title, maxUses, requireComment });
  }, [id, title, maxUses, requireComment]);

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
            <p className="text-sm line-clamp-1 text-gray-500">
              {firstName} {lastName || ""}
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
