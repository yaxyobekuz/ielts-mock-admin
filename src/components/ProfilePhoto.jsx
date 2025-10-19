// Gradients
import gradients from "@/data/gradients";

// Helpers
import { extractNumbers } from "@/lib/helpers";

// Hooks
import useObjectStore from "@/hooks/useObjectStore";

// Component
const ProfilePhoto = ({
  user,
  size = 48,
  photoSize = "small",
  className = "size-12 rounded-full",
}) => {
  const { getEntity } = useObjectStore("users");
  const userDataFromStore = getEntity("me");

  const {
    lastName,
    firstName,
    _id: userId,
    avatar: userAvatar,
  } = user || userDataFromStore;
  const avatar = typeof userAvatar === "object" ? userAvatar : null;

  const props = {
    size,
    avatar,
    userId,
    photoSize,
    fullName: `${firstName} ${lastName || ""}`.trim(),
    className: `flex items-center justify-center font-semibold shrink-0 ${className}`,
  };

  if (avatar) return <Photo {...props} />;
  else return <TextPhoto {...props} />;
};

// Photo image
const Photo = ({ avatar, fullName, className, size, photoSize }) => (
  <img
    width={size}
    height={size}
    alt={`${fullName}ning profil rasmi`}
    title={`${fullName}ning profil rasmi`}
    src={avatar.sizes?.[photoSize || "small"]?.url}
    className={`${className} bg-gray-200 text-[10px] object-cover object-center aspect-square`}
  />
);

// Text photo
const TextPhoto = ({ fullName = "Foydalanuvchi", userId, className }) => {
  const nums = extractNumbers(userId);
  const gradientIndex = nums[nums.length - 1];
  const gradientColor = gradients[gradientIndex];
  const firstLetter = fullName?.[0]?.toUpperCase();

  return (
    <span
      role="img"
      alt={`${fullName}ning profil rasmi`}
      title={`${fullName}ning profil rasmi`}
      className={`${className} ${gradientColor}`}
    >
      {firstLetter}
    </span>
  );
};

export default ProfilePhoto;
