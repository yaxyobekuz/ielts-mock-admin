// React
import { useEffect } from "react";

// Router
import { Link } from "react-router-dom";

// Hooks
import useStore from "@/hooks/useStore";
import useModal from "@/hooks/useModal";

// Teachers api
import { teachersApi } from "@/api/teachers.api";

// Components
import Button from "@/components/form/Button";
import CopyButton from "@/components/CopyButton";
import ProfilePhoto from "@/components/ProfilePhoto";

// Icons
import { Clock, IdCardIcon, Plus, Signature } from "lucide-react";

// Helpers
import { formatDate, formatTime, formatUzPhone } from "@/lib/helpers";

const Teachers = () => {
  const { getData, updateProperty } = useStore("teachers");
  const { isLoading, hasError, data: teachers } = getData();

  const loadTeachers = () => {
    updateProperty("isLoading", true);
    updateProperty("hasError", false);

    teachersApi
      .get()
      .then(({ teachers, code }) => {
        if (code !== "teachersFetched") throw new Error();
        updateProperty("data", teachers);
      })
      .catch(() => updateProperty("hasError", true))
      .finally(() => updateProperty("isLoading", false));
  };

  // Load user profile
  useEffect(() => {
    isLoading && loadTeachers();
  }, []);

  return (
    <div className="container py-8 space-y-6">
      {/* Title */}
      <h1>Ustozlar</h1>

      {/* Main */}
      <main className="grid grid-cols-4 gap-5">
        <Main isLoading={isLoading} hasError={hasError} teachers={teachers} />
      </main>
    </div>
  );
};

const Main = ({ isLoading, hasError, teachers = [] }) => {
  if (isLoading) {
    return Array.from({ length: 8 }, (_, index) => {
      return <TeacherItemSkeleton key={index} />;
    });
  }

  if (hasError) {
    return <div className="">Error</div>;
  }

  return (
    <>
      <AddNew />

      {teachers.map((teacher) => (
        <TeacherItem key={teacher?._id} {...teacher} />
      ))}
    </>
  );
};

const AddNew = () => {
  const { openModal } = useModal("createTeacher");

  return (
    <Button
      variant="danger"
      onClick={() => openModal()}
      className="relative group gap-3.5 min-h-[200px] !rounded-3xl"
    >
      <span className="text-xl font-medium text-white">Ustoz qo'shish</span>
      <Plus
        size={32}
        color="white"
        className="transition-transform duration-200 group-hover:rotate-180 group-disabled:!rotate-0"
      />
    </Button>
  );
};

const TeacherItem = ({
  avatar,
  phone,
  _id: id,
  nickname,
  createdAt,
  lastName = "",
  firstName = "Foydalanuvchi",
}) => {
  return (
    <div className="flex flex-col gap-3.5 justify-between relative w-full min-h-52 bg-gray-100 rounded-3xl p-5 transition-all duration-200 hover:bg-gray-50">
      {/* Profile */}
      <div className="flex items-center gap-3.5">
        <ProfilePhoto user={{ _id: id, firstName, lastName, avatar }} />

        <div className="h-12">
          <h3 className="text-xl font-medium line-clamp-1">
            {`${firstName} ${lastName}`}
          </h3>

          <a
            href={`tel:+${phone}`}
            className="relative z-10 text-gray-500 text-sm transition-colors duration-200 hover:text-blue-500"
          >
            {formatUzPhone(phone)}
          </a>
        </div>
      </div>

      {/* Mid */}
      <div className="space-y-1.5">
        {/* Status */}
        <div className="flex items-center gap-1.5">
          <Signature strokeWidth={1.5} size={18} />
          <p className="text-[15px]">
            <span>Tahallus: </span>
            <span className="text-blue-500">{nickname || "Ustoz"}</span>
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
        {/* Teacher id */}
        <CopyButton
          text={id}
          notificationText="ID raqamdan nusxa olindi"
          className="flex items-center justify-center gap-1.5 relative z-10 max-w-full text-gray-500 hover:text-blue-500 disabled:text-gray-500 disabled:opacity-50"
        >
          <IdCardIcon
            size={18}
            strokeWidth={1.5}
            className="shrink-0 transition-colors duration-200"
          />
          <span className="truncate transition-colors duration">{id}</span>
        </CopyButton>
      </div>

      {/* Link */}
      <Link
        to={`/teachers/${id}`}
        className="block absolute z-0 inset-0 size-full rounded-3xl"
      />
    </div>
  );
};

const TeacherItemSkeleton = () => (
  <div className="w-full min-h-52 bg-gray-100 rounded-3xl p-5 space-y-5 animate-pulse" />
);

export default Teachers;
