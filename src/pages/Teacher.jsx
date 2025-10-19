// Toast
import { toast } from "@/notification/toast";

// UI components
import { Switch } from "@/components/ui/switch";

// Data
import permissionsData from "@/data/permissions";

// Api
import { teachersApi } from "@/api/teachers.api";

// Router
import { Link, useParams } from "react-router-dom";

// Hooks
import useModal from "@/hooks/useModal";
import useObjectState from "@/hooks/useObjectState";
import useObjectStore from "@/hooks/useObjectStore";

// Components
import Button from "@/components/form/Button";
import ProfilePhoto from "@/components/ProfilePhoto";

// React
import { useCallback, useEffect, useMemo } from "react";

// Helpers
import { formatDate, formatTime, formatUzPhone } from "@/lib/helpers";

// Icons
import { Clock, Trash, RefreshCcw, ArrowUpRight } from "lucide-react";

const Teacher = () => {
  const { teacherId } = useParams();
  const { openModal } = useModal("deleteTeacher");
  const { addEntity, getEntity, updateEntity } = useObjectStore("teachers");

  const teacher = getEntity(teacherId);
  const { setField, isLoading, hasError, permissions, isUpdating } =
    useObjectState({
      hasError: false,
      isUpdating: false,
      isLoading: !teacher,
      permissions: teacher?.permissions || {},
    });

  const loadTeacher = () => {
    setField("hasError");
    setField("isLoading", true);

    teachersApi
      .getById(teacherId)
      .then(({ code, teacher }) => {
        if (code !== "teacherFetched") throw new Error();

        addEntity(teacherId, teacher);
        setField("permissions", teacher.permissions || {});
      })
      .catch(({ message }) => {
        setField("hasError", true);
        toast.error(message || "Nimadir xato ketdi");
      })
      .finally(() => setField("isLoading"));
  };

  const updateTeacherPermissions = () => {
    if (isUpdating || isLoading) return;

    setField("isUpdating", true);

    teachersApi
      .updatePermissions(teacherId, permissions)
      .then(({ code, permissions, message }) => {
        if (code !== "teacherPermissionsUpdated") throw new Error();

        toast.success(message);
        setField("permissions", permissions);
        updateEntity(teacherId, { permissions });
      })
      .catch(({ message }) => toast.error(message || "Nimadir xato ketdi"))
      .finally(() => setField("isUpdating"));
  };

  const handlePermissionChange = useCallback(
    (key, value) => {
      setField("permissions", { ...permissions, [key]: value });
    },
    [teacherId, permissions]
  );

  const hasPermissionsChanged = useMemo(() => {
    if (!teacher) return false;
    const originalPermissions = teacher.permissions || {};
    return Object.keys(permissionsData).some(
      (key) => originalPermissions[key] !== permissions[key]
    );
  }, [teacherId, permissions]);

  useEffect(() => {
    isLoading && loadTeacher();
  }, []);

  if (isLoading) return <LoadingContent />;
  if (hasError) return <ErrorContent />;

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1>Ustoz</h1>

        <div className="flex items-center gap-5">
          {/* Parts count */}
          <div title="Vaqt" className="flex items-center gap-1.5">
            <Clock strokeWidth={1.5} size={22} />
            <span>
              {formatDate(teacher?.createdAt)}{" "}
              <span className="text-gray-500">
                {formatTime(teacher?.createdAt)}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-5">
        {/* Open delete teacher modal button */}
        <button
          title="Ustozni o'chirish"
          aria-label="Ustozni o'chirish"
          onClick={() => openModal({ teacherId })}
          className="btn gap-1.5 h-11 bg-red-50 py-0 rounded-full text-red-500 hover:bg-red-100"
        >
          <Trash size={20} strokeWidth={1.5} />
          O'chirish
        </button>
      </div>

      {/* Main */}
      <div className="grid grid-cols-4 gap-5">
        {/* Profile */}
        <Profile teacher={teacher} />

        {/* Permissions */}
        <section className="flex flex-col col-span-3 w-full h-auto bg-gray-100 rounded-3xl p-5">
          {/* Title */}
          <h2 className="mb-3.5 text-xl font-medium">Ruxsatlar</h2>

          {/* Content */}
          <ul className="grid grid-cols-4 gap-5 mb-5">
            {Object.keys(permissionsData).map((permissionKey) => {
              const { name, methodColor } =
                permissionsData[permissionKey] || {};

              return (
                <li key={permissionKey}>
                  <label
                    htmlFor={permissionKey}
                    className="flex items-center justify-between gap-1.5 bg-white h-14 px-3.5 rounded-xl cursor-pointer"
                  >
                    {/* Name */}
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`size-3 shrink-0 rounded-full ${methodColor}`}
                      />
                      <h3 className="font-medium">{name}</h3>
                    </div>

                    {/* Switch */}
                    <Switch
                      id={permissionKey}
                      checked={permissions?.[permissionKey]}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(permissionKey, checked)
                      }
                    />
                  </label>
                </li>
              );
            })}
          </ul>

          {/* Update permissions button */}
          <Button
            size="lg"
            className="w-36 gap-1.5"
            onClick={updateTeacherPermissions}
            disabled={isUpdating || isLoading || !hasPermissionsChanged}
          >
            <RefreshCcw size={20} strokeWidth={1.5} className="mr-1" />
            Yangilash
          </Button>
        </section>
      </div>
    </div>
  );
};

const LoadingContent = () => (
  <div className="container py-8 space-y-6">
    {/* Top */}
    <div className="flex items-center justify-between">
      <h1>Yuklanmoqda...</h1>
      <div className="w-48 h-6 bg-gray-100 p-0 rounded-full animate-pulse" />
    </div>

    {/* Action buttons */}
    <div className="flex items-center justify-end gap-5 animate-pulse">
      <div className="w-32 h-11 bg-gray-100 py-0 rounded-full" />
    </div>

    {/* Main content */}
    <div className="grid grid-cols-4 gap-5 animate-pulse">
      <div className="h-auto aspect-square bg-gray-100 rounded-3xl" />
      <div className="col-span-3 h-[125%] bg-gray-100 rounded-3xl" />
    </div>
  </div>
);

const ErrorContent = () => {
  return <div className="">Error</div>;
};

const Profile = ({ teacher }) => (
  <section className="flex flex-col justify-between relative overflow-hidden w-full h-auto bg-gray-100 bg-cover bg-no-repeat aspect-square rounded-3xl">
    {/* Top */}
    <div className="flex items-center justify-end p-5 z-10">
      <Link
        to={`/teachers/${teacher._id}`}
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
        {teacher.firstName || "Foydalanuvchi"} {teacher.lastName}
      </h2>

      <div className="flex items-center justify-between">
        {/* Role */}
        <span className="capitalize shrink-0 text-gray-200">
          {teacher.role || "Noma'lum"}
        </span>

        {/* Phone */}
        <a href={`tel:+${teacher.phone}`} className="shrink-0 text-gray-200">
          {formatUzPhone(teacher.phone)}
        </a>
      </div>
    </div>

    {/* Photo */}
    <ProfilePhoto
      user={teacher}
      photoSize="medium"
      className="absolute inset-0 z-0 size-full text-9xl"
    />
  </section>
);

export default Teacher;
