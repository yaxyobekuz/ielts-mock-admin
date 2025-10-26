// Helpers
import { formatDate } from "./helpers";

const defaultFormat = {
  y: (y) => y,
  value: (value) => value,
  x: (x) => formatDate(x, true),
};

export const transformLineChartData = (
  data = [],
  name = "",
  format = defaultFormat
) => {
  if (!data || !Array.isArray(data)) return {};

  return {
    id: name,
    data: data.map(({ x, y }) => ({
      
      date: x,
      x: format?.x?.(x) || defaultFormat.x(x),
      y: format?.y?.(y) || defaultFormat.y(y),
      value: format?.value?.(y) || defaultFormat.value(y),
    })),
  };
};
