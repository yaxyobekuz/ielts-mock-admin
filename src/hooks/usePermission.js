import useStore from "./useStore";

const usePermission = (role = "teacher", userData) => {
  let user = userData;

  if (typeof userData !== "object") {
    const { getProperty } = useStore("user");
    user = getProperty("data");
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
