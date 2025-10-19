import useObjectStore from "./useObjectStore";

const usePermission = (role = "teacher", userData) => {
  let user = userData;

  if (typeof userData !== "object") {
    const { getEntity } = useObjectStore("users");
    user = getEntity("me");
  }

  const checkPermission = (...permissions) => {
    if (user.role !== role) return true;

    const hasAll = permissions.every(
      (key) => user.permissions && user.permissions[key]
    );

    return hasAll;
  };

  return { checkPermission, user };
};

export default usePermission;
