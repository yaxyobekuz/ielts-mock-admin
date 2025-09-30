const navlinks = [
  {
    label: "Asosiy",
    link: "",
    allowed: ["supervisor", "teacher"],
  },
  {
    label: "Ustozlar",
    link: "teachers",
    allowed: ["supervisor"],
  },
  {
    label: "Testlar",
    link: "tests",
    allowed: ["supervisor", "teacher"],
  },
  {
    label: "Javoblar",
    link: "submissions",
    allowed: ["supervisor", "teacher"],
  },
  {
    label: "Natijalar",
    link: "results",
    allowed: ["supervisor", "teacher"],
  },
  {
    label: "Havolalar",
    link: "links",
    allowed: ["supervisor", "teacher"],
  },
  {
    label: "Ta'riflar",
    link: "plans",
    allowed: ["supervisor"],
  },
  {
    label: "To'lov",
    link: "payment",
    allowed: ["supervisor"],
  },
  {
    label: "Statistika",
    link: "statistics",
    allowed: ["supervisor", "teacher"],
  },
];

export const getNavlinksByRole = (role) => {
  return navlinks.filter(({ allowed }) => allowed.includes(role));
};

export default navlinks;
