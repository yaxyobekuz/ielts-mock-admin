// React
import { useMemo } from "react";

// Api
import { usersApi } from "@/api/users.api";

// Toast
import { toast } from "@/notification/toast";

// Components
import Input from "../form/Input";
import Button from "../form/Button";
import ProfilePhoto from "../ProfilePhoto";
import ResponsiveModal from "../ResponsiveModal";

// Hooks
import useModal from "@/hooks/useModal";
import useObjectStore from "@/hooks/useObjectStore";
import useObjectState from "@/hooks/useObjectState";

// Icons
import { Camera, ChevronLeft, Info, LogOut } from "lucide-react";

// Helpers
import { formatDate, formatTime, formatUzPhone } from "@/lib/helpers";

const ProfileModal = () => (
  <ResponsiveModal name="profile" title="Mening profilim">
    <Content />
  </ResponsiveModal>
);

const Content = ({ close, defaultOpenEditor, isLoading, setIsLoading }) => {
  const { openModal } = useModal("updateAvatar");
  const { getEntity, updateEntity } = useObjectStore("users");
  const {
    role,
    phone,
    createdAt,
    bio: initialBio,
    lastName: initialLastName,
    firstName: initialFirstName,
  } = getEntity("me") || {};

  const { setField, setFields, lastName, firstName, isOpen, bio } =
    useObjectState({
      phone,
      bio: initialBio,
      isOpen: defaultOpenEditor,
      lastName: initialLastName,
      firstName: initialFirstName,
    });

  const isChanged = useMemo(() => {
    return (
      initialBio !== bio ||
      initialLastName !== lastName ||
      initialFirstName !== firstName
    );
  }, [lastName, firstName, initialLastName, initialFirstName, bio, initialBio]);

  const handleEditProfile = (e) => {
    e.preventDefault();
    if (isLoading || !isChanged) return;
    setIsLoading(true);

    const formData = {
      bio: bio?.trim(),
      lastName: lastName?.trim(),
      firstName: firstName?.trim(),
    };

    usersApi
      .update(formData)
      .then(({ code, user, updates }) => {
        if (code !== "userUpdated") throw new Error();

        close();
        setFields(updates);
        updateEntity("me", user);
        toast.success("Profil ma'lumotlari yangilandi");
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => setIsLoading(false));
  };

  const handleOpenUpdateAvatarModal = () => {
    close();
    setTimeout(openModal, 200);
  };

  const handleLogout = () => {
    if (confirm("Hisobingizdan chiqmoqchimisiz?")) {
      localStorage.removeItem("auth");
      window.location.reload();
    }
  };

  // Edit profile
  if (isOpen) {
    return (
      <>
        {/* Back */}
        <button
          disabled={isLoading}
          onClick={() => setField("isOpen", false)}
          className="flex items-center gap-1.5 max-w-max text-gray-500 transition-colors duration-200 hover:text-gray-700 max-sm:mb-3.5 max-sm:-mt-6"
        >
          <ChevronLeft size={20} />
          Ortga
        </button>

        {/* Form */}
        <form onSubmit={handleEditProfile} className="space-y-5">
          {/* First Name */}
          <Input
            border
            required
            size="lg"
            label="Ism"
            maxLength={24}
            name="firstName"
            value={firstName}
            placeholder="Ismingizni kiriting"
            onChange={(val) => setField("firstName", val)}
          />

          {/* Last Name */}
          <Input
            border
            size="lg"
            maxLength={24}
            name="lastName"
            value={lastName}
            label="Familiya"
            placeholder="Familiyangizni kiriting"
            onChange={(val) => setField("lastName", val)}
          />

          {/* Bio */}
          <Input
            border
            size="lg"
            name="bio"
            value={bio}
            label="Bio"
            maxLength={144}
            type="textarea"
            placeholder="Biografiyangizni kiriting"
            onChange={(val) => setField("bio", val)}
          />

          {/* Buttons */}
          <div className="flex justify-end gap-5 w-full">
            <Button
              type="button"
              className="w-32"
              variant="neutral"
              onClick={() => close()}
            >
              Bekor qilish
            </Button>

            <Button className="w-32" disabled={isLoading || !isChanged}>
              Yangilash
            </Button>
          </div>
        </form>
      </>
    );
  }

  // Profile
  return (
    <div className="space-y-5 pt-3.5">
      <div className="flex items-center justify-between gap-1.5">
        {/* Profile */}
        <div className="flex items-center gap-3.5">
          <ProfilePhoto className="size-16 rounded-full" />
          <div className="space-y-1">
            <b className="line-clamp-1 font-semibold">
              {initialFirstName + " " + (initialLastName || "")}
            </b>

            <p className="text-sm text-gray-500 capitalize">{role}</p>
          </div>
        </div>

        {/* Upload Photo Btn */}
        <button
          onClick={handleOpenUpdateAvatarModal}
          className="btn size-11 bg-gray-100 rounded-full p-0 hover:text-blue-500"
        >
          <Camera size={22} strokeWidth={1.5} />
        </button>
      </div>

      <hr />

      {/* Info */}
      <div className="flex items-start gap-3.5">
        <Info className="shrink-0 size-6" strokeWidth={1.5} />

        {/* Main */}
        <div className="space-y-3.5">
          {/* Phone */}
          <div className="space-y-0.5">
            <a href={`tel:+${phone}`} className="">
              {formatUzPhone(phone)}
            </a>
            <p className="text-sm text-gray-500">Telefon raqam</p>
          </div>

          {/* Bio */}
          {bio && (
            <div className="space-y-0.5">
              <p className="break-words">{bio}</p>
              <p className="text-sm text-gray-500">Biografiya</p>
            </div>
          )}

          {/* Created at */}
          <div className="space-y-0.5">
            <p className="break-words">
              {formatDate(createdAt)}
              <span className="text-gray-500"> {formatTime(createdAt)}</span>
            </p>
            <p className="text-sm text-gray-500">Ro'yxatdan o'tilgan</p>
          </div>
        </div>
      </div>

      <hr />

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="btn gap-3.5 px-0 text-red-500 hover:text-red-600"
      >
        <LogOut size={20} strokeWidth={1.5} />
        Hisobdan chiqish
      </button>

      {/* Edit button */}
      <Button
        variant="neutral"
        className="w-full"
        onClick={() => setField("isOpen", true)}
      >
        Tahrirlash
      </Button>
    </div>
  );
};

export default ProfileModal;
