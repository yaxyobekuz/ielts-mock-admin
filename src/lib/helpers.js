// Check if string is a valid number
export const isNumber = (string) => {
  // Check if input is string
  if (typeof string !== "string") return false;

  // Check if string is empty or only whitespace
  if (string.trim() === "") return false;

  // Use Number() and isNaN() to check validity
  return !isNaN(Number(string));
};

export const countSpecificCharacter = (text, char) => {
  return text.split(char).length - 1;
};

export const countExactMatches = (text, target) => {
  return (
    text?.match(
      new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")
    ) || []
  ).length;
};

export const getRandomNumber = (min = 0, max = 1) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Format date
export const formatDate = (input) => {
  if (!input) return null;

  const date = new Date(input);

  const year = date.getFullYear();
  const day = date.getDate();

  const months = [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avgust",
    "sentyabr",
    "oktyabr",
    "noyabr",
    "dekabr",
  ];

  const monthName = months[date.getMonth()];

  return `${day}-${monthName}, ${year}`;
};

// Format time
export const formatTime = (input) => {
  if (!input) return null;

  const date = new Date(input);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const extractNumbers = (text = "") => {
  return text?.replace(/\D/g, "");
};

export const formatUzPhone = (input) => {
  const d = String(input).replace(/\D/g, "");
  const m = d.match(/^998(\d{2})(\d{3})(\d{2})(\d{2})$/);
  return m ? `+998 (${m[1]}) ${m[2]} ${m[3]} ${m[4]}` : String(input);
};

export const formatUzPhoneLive = (input) => {
  const d = String(input).replace(/\D/g, "").slice(0, 12);
  let out = "";
  if (!d.startsWith("998")) out = d;
  else {
    const body = d.slice(3);
    out = "+998";
    if (body.length) out += " (" + body.slice(0, 2);
    if (body.length >= 2) out += ")";
    if (body.length > 2) out += " " + body.slice(2, 5);
    if (body.length > 5) out += " " + body.slice(5, 7);
    if (body.length > 7) out += " " + body.slice(7, 9);
  }
  return out.trim();
};
