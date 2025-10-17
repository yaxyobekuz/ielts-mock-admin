// Icons
import {
  Eye,
  Book,
  Hash,
  Edit,
  Copy,
  Clock,
  Trash,
  ArrowUpRight,
  MousePointerClick,
  MessageCircle,
} from "lucide-react";

// Helpers
import {
  formatDate,
  formatTime,
  formatUzPhone,
  getDeviceInfo,
} from "@/lib/helpers";

// Api
import { linksApi } from "@/api/links.api";

// Toast
import { toast } from "@/notification/toast";

// React
import { useCallback, useEffect } from "react";

// Router
import { Link, useParams } from "react-router-dom";

// Hooks
import useStore from "@/hooks/useStore";
import useModal from "@/hooks/useModal";
import usePermission from "@/hooks/usePermission";
import useObjectState from "@/hooks/useObjectState";

// Components
import CopyButton from "@/components/CopyButton";
import ProfilePhoto from "@/components/ProfilePhoto";

// Data
import assessmentCriteria from "@/data/assessmentCriteria";

let uniquecriteriaNames = {};
assessmentCriteria.forEach(({ criteria }) => {
  criteria.forEach((arr) => {
    arr.forEach(({ name, key }) => {
      uniquecriteriaNames[key] = name;
    });
  });
});

const LinkPage = () => {
  const { linkId } = useParams();
  const { getProperty, updateProperty } = useStore("link");
  const link = getProperty(linkId);

  const { setField, isLoading, hasError } = useObjectState({
    hasError: false,
    isLoading: !link,
  });

  const loadLink = () => {
    setField("hasError");
    setField("isLoading", true);

    linksApi
      .getById(linkId)
      .then(({ code, link }) => {
        if (code !== "linkFetched") throw new Error();
        updateProperty(linkId, link);
      })
      .catch(({ message }) => {
        setField("hasError", true);
        toast.error(message || "Nimadir xato ketdi");
      })
      .finally(() => setField("isLoading"));
  };

  useEffect(() => {
    isLoading && loadLink();
  }, []);

  // Content
  if (isLoading) return <LoadingContent />;
  if (hasError) return <ErrorContent />;
  return <MainContent {...link} />;
};

const MainContent = ({
  title,
  testId,
  usages,
  visits,
  _id: id,
  maxUses,
  createdAt,
  createdBy,
  usedCount,
  visitsCount,
  requireComment,
}) => {
  const { openModal } = useModal("editLink");
  const { checkPermission } = usePermission();
  const siteUrl = import.meta.env.VITE_SITE_URL;

  // Permissions
  const canEditLink = checkPermission("canEditLink");
  const canDeleteLink = checkPermission("canDeleteLink");

  const openEditLinkModal = useCallback(() => {
    if (!canEditLink) return;
    openModal({ linkId: id, title, maxUses, requireComment });
  }, [id, title, maxUses, requireComment]);

  const openDeleteLinkModal = useCallback(() => {
    if (!canDeleteLink) return;
    openModal({ linkId: id }, "deleteLink");
  }, [id]);

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1>
          {title}
          <span className="text-gray-500"> havolasi</span>
        </h1>

        {/* Date & time */}
        <div title="Vaqt" className="flex items-center gap-1.5">
          <Clock strokeWidth={1.5} size={22} />
          <span>{formatDate(createdAt)} </span>
          <span className="text-gray-500">{formatTime(createdAt)}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-5 w-full">
        {/* Copy link */}
        <CopyButton
          text={`${siteUrl}/link/${id}`}
          notificationText="Havoladan nusxa olindi"
          className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
        >
          <Copy size={20} strokeWidth={1.5} />
          Havoladan nusxa olish
        </CopyButton>

        {/* Open edit test modal button */}
        <button
          disabled={!canEditLink}
          onClick={openEditLinkModal}
          className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
        >
          <Edit size={20} strokeWidth={1.5} />
          Tahrirlash
        </button>

        {/* Test */}
        <Link
          to={`/tests/${testId}`}
          className="btn gap-1.5 h-11 bg-gray-100 py-0 rounded-full hover:bg-gray-200"
        >
          <Book size={20} strokeWidth={1.5} />
          <span>Test</span>
        </Link>

        {/* Open delete link modal button */}
        <button
          disabled={!canDeleteLink}
          title="Havolani o'chirish"
          onClick={openDeleteLinkModal}
          aria-label="Havolani o'chirish"
          className="btn size-11 bg-red-50 p-0 rounded-full text-red-500 hover:bg-red-100 disabled:opacity-50 disabled:hover:bg-red-50"
        >
          <Trash size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {/* Profile */}
        <Profile createdBy={createdBy || {}} />

        {/* Info */}
        <section className="h-auto bg-gray-100 bg-cover bg-no-repeat aspect-square rounded-3xl p-5">
          {/* Title */}
          <h2 className="mb-5 text-xl font-medium">Ba'tafsil</h2>

          <div className="space-y-3.5">
            {/* Max uses */}
            <div className="flex items-center gap-1.5">
              <Hash strokeWidth={1.5} className="shrink-0" size={20} />
              <div className="flex items-center justify-between w-full">
                <span>Max foydalanishlar </span>
                <span className="text-gray-600">{maxUses} ta</span>
              </div>
            </div>

            {/* Max uses */}
            <div className="flex items-center gap-1.5">
              <Hash strokeWidth={1.5} className="shrink-0" size={20} />
              <div className="flex items-center justify-between w-full">
                <span>Qolgan foydalanishlar </span>
                <span className="text-gray-600">{maxUses - usedCount} ta</span>
              </div>
            </div>

            {/* Require comment */}
            <div className="flex items-center gap-1.5">
              <MessageCircle size={20} strokeWidth={1.5} className="shrink-0" />
              <div className="flex items-center justify-between w-full">
                <span>Sharh qoldirishni so'rash </span>
                <span
                  className={requireComment ? "text-green-500" : "text-red-500"}
                >
                  {requireComment ? "Ha" : "Yo'q"}
                </span>
              </div>
            </div>

            {/* Visits */}
            <div className="flex items-center gap-1.5">
              <Eye strokeWidth={1.5} className="shrink-0" size={20} />
              <div className="flex items-center justify-between w-full">
                <span>Ta'shriflar </span>
                <span className="text-gray-600">{visitsCount} ta</span>
              </div>
            </div>

            {/* Uses */}
            <div className="flex items-center gap-1.5">
              <MousePointerClick
                strokeWidth={1.5}
                className="shrink-0"
                size={20}
              />
              <div className="flex items-center justify-between w-full">
                <span>Testni ishlatishlar </span>
                <span className="text-gray-600">{usedCount} ta</span>
              </div>
            </div>
          </div>
        </section>

        {/* Visits */}
        <section className="h-auto bg-gray-100 bg-cover bg-no-repeat aspect-square rounded-3xl p-5">
          {/* Top */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-medium">Ta'shriflar</h2>
            <p className="text-lg">{visitsCount} ta</p>
          </div>

          <ul className="space-y-5 max-h-[calc(100%-48px)] pr-1.5 overflow-y-auto scroll-y-primary">
            {visits.map(({ _id: id, userAgent, createdAt }, index) => (
              <li
                key={id}
                className="flex items-center justify-between gap-2 pr-1 relative"
              >
                <div className="flex items-center gap-2">
                  {/* Photo */}
                  <div className="btn size-11 p-0 bg-black/70 rounded-full shrink-0 text-white font-semibold">
                    {index + 1}
                  </div>

                  <div className="space-y-1">
                    {/* Title */}
                    <h3 className="capitalize line-clamp-1 font-medium">
                      {getDeviceInfo(userAgent)}
                    </h3>

                    {/* Created At */}
                    <p className="line-clamp-1 text-sm">
                      <span className="">{formatDate(createdAt)} </span>
                      <span className="text-gray-500">
                        {formatTime(createdAt)}
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Usages */}
        <section className="h-auto bg-gray-100 bg-cover bg-no-repeat aspect-square rounded-3xl p-5">
          {/* Top */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-medium">Testni ishlatishlar</h2>
            <p className="text-lg">{usedCount} ta</p>
          </div>

          <ul className="space-y-5 max-h-[calc(100%-48px)] pr-1.5 overflow-y-auto scroll-y-primary">
            {usages.map(({ _id: id, userAgent, createdAt }, index) => (
              <li
                key={id}
                className="flex items-center justify-between gap-2 pr-1 relative"
              >
                <div className="flex items-center gap-2">
                  {/* Photo */}
                  <div className="btn size-11 p-0 bg-black/70 rounded-full shrink-0 text-white font-semibold">
                    {index + 1}
                  </div>

                  <div className="space-y-1">
                    {/* Title */}
                    <h3 className="capitalize line-clamp-1 font-medium">
                      {getDeviceInfo(userAgent)}
                    </h3>

                    {/* Created At */}
                    <p className="line-clamp-1 text-sm">
                      <span className="">{formatDate(createdAt)} </span>
                      <span className="text-gray-500">
                        {formatTime(createdAt)}
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

const Profile = ({ createdBy }) => (
  <section className="flex flex-col justify-between relative overflow-hidden w-full h-auto bg-gray-100 bg-cover bg-no-repeat aspect-square rounded-3xl">
    {/* Top */}
    <div className="flex items-center justify-end p-5 z-10">
      <Link
        to={`/users/${createdBy._id}`}
        title="Foydalanuvchi profili"
        aria-label="Foydalanuvchi profili"
        className="btn size-10 p-0 rounded-full bg-white backdrop-blur-sm"
      >
        <ArrowUpRight size={20} />
      </Link>
    </div>

    {/* Bottom */}
    <div className="z-10 w-full p-5 mt-auto bg-gradient-to-b from-transparent to-black">
      {/* Full name */}
      <h2 className="mb-3 truncate capitalize text-xl font-medium text-white">
        {createdBy.firstName || "Foydalanuvchi"} {createdBy.lastName}
      </h2>

      <div className="flex items-center justify-between">
        {/* Role */}
        <span className="capitalize shrink-0 text-gray-200">
          {createdBy.role || "Noma'lum"}
        </span>

        {/* Phone */}
        <a href={`tel:+${createdBy.phone}`} className="shrink-0 text-gray-200">
          {formatUzPhone(createdBy.phone || 998000000000)}
        </a>
      </div>
    </div>

    {/* Photo */}
    <ProfilePhoto
      user={createdBy}
      photoSize="medium"
      className="absolute inset-0 z-0 size-full text-9xl"
    />
  </section>
);

const LoadingContent = () => {
  return (
    <div className="container py-8 space-y-6">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1>Foydalanuvchining javoblari</h1>

        <div className="btn w-52 h-6 bg-gray-100 py-0 rounded-full animate-pulse" />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-5">
        <div className="btn w-24 h-11 bg-gray-100 py-0 rounded-full" />
        <div className="btn w-32 h-11 bg-gray-100 py-0 rounded-full" />
        <div className="btn w-40 h-11 bg-gray-100 py-0 rounded-full" />
      </div>

      {/* Grid */}
      <ul className="grid grid-cols-4 gap-5 animate-pulse">
        {Array.from({ length: 4 }, (_, index) => (
          <li
            key={index}
            className="h-auto aspect-square bg-gray-100 rounded-3xl"
          />
        ))}
      </ul>
    </div>
  );
};

const ErrorContent = () => {
  return (
    <div className="container py-8 space-y-6">
      <div>Error</div>
    </div>
  );
};

export default LinkPage;
