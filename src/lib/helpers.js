// String formatters
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

// Time formatters
export const formatDate = (input, hideYear = false) => {
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

  let result = `${day}-${monthName}`;
  if (!hideYear) result += `, ${year}`;
  return result;
};

export const formatTime = (input) => {
  if (!input) return null;

  const date = new Date(input);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

// Phone formatters
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

// Ielts score calculator
export const getIeltsScore = (correctAnswers = 0, module = "listening") => {
  const tables = {
    listening: {
      40: 9,
      39: 9,
      38: 8.5,
      37: 8.5,
      36: 8,
      35: 8,
      34: 7.5,
      33: 7.5,
      32: 7.5,
      31: 7,
      30: 7,
      29: 6.5,
      28: 6.5,
      27: 6.5,
      26: 6.5,
      25: 6,
      24: 6,
      23: 6,
      22: 5.5,
      21: 5.5,
      20: 5.5,
      19: 5.5,
      18: 5.5,
      17: 5,
      16: 5,
      15: 4.5,
      14: 4.5,
      13: 4.5,
      12: 4,
      11: 4,
      0: 0,
    },
    reading: {
      40: 9,
      39: 9,
      37: 8.5,
      38: 8.5,
      35: 8,
      36: 8,
      33: 7.5,
      34: 7.5,
      30: 7,
      31: 7,
      32: 7,
      27: 6.5,
      28: 6.5,
      29: 6.5,
      23: 6,
      24: 6,
      25: 6,
      26: 6,
      19: 5.5,
      20: 5.5,
      21: 5.5,
      22: 5.5,
      15: 5,
      16: 5,
      17: 5,
      18: 5,
      13: 4.5,
      14: 4.5,
      10: 4,
      11: 4,
      12: 4,
      8: 3.5,
      9: 3.5,
      6: 3,
      7: 3,
      4: 2.5,
      5: 2.5,
      0: 0,
    },
  };

  const table = tables[module];
  if (!table) return null;

  // Find the score for the given number of correct answers
  if (table[correctAnswers] !== undefined) {
    return table[correctAnswers];
  }

  // If exact match not found, return 0 for very low scores
  return 0;
};

export const appendDotZero = (value) => {
  return String(value)?.padEnd(3, ".0");
};
