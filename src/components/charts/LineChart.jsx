// Helpers
import { formatDate } from "@/lib/helpers";

// Nivo
import { ResponsiveLine } from "@nivo/line";

const LineChart = ({
  data = [],
  colorIndex = 0,
  className = "",
  enableArea = false,
}) => {
  // Filter out empty data series
  const validData = data?.filter(
    (series) => series.data && series.data.length > 0
  );

  // Define available colors
  const availableColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  // Determine the color to use
  const selectedColor =
    validData.length === 1 && colorIndex !== undefined
      ? availableColors[colorIndex]
      : availableColors;

  const hasOneItem = validData.length === 1;
  const gradientId = `gradient-${colorIndex}`;

  const renderTooltip = ({ slice }) => {
    return (
      <div className="w-max bg-white px-3.5 py-2 rounded-xl shadow-lg border">
        {/* Points */}
        <ul className="mb-1">
          {slice.points.map((point) => (
            <li key={point.id} className="flex items-center gap-3 text-sm">
              <div
                className="size-2 rounded-full"
                style={{ backgroundColor: point.seriesColor || "#000" }}
              />

              {/* Label */}
              <h3 className="grow text-gray-700">{point.seriesId}: </h3>

              {/* Value */}
              <span className="font-semibold">{point.data.value}</span>
            </li>
          ))}
        </ul>

        {/* Date */}
        <p className="text-right text-xs text-gray-500">
          {formatDate(slice.points[0].data.date)}
        </p>
      </div>
    );
  };

  return (
    <div className={className}>
      <ResponsiveLine
        lineWidth={2.5}
        data={validData}
        enableSlices="x"
        curve="catmullRom"
        enableGridX={false}
        enablePoints={false}
        enableTouchCrosshair
        crosshairType="cross"
        enableArea={enableArea}
        sliceTooltip={renderTooltip}
        fill={[{ match: "*", id: gradientId }]}
        axisBottom={{ tickRotation: -45, legendOffset: 36 }}
        margin={{ top: 12, left: 48, right: 32, bottom: 80 }}
        colors={hasOneItem && colorIndex ? [selectedColor] : availableColors}
        defs={[
          {
            id: gradientId,
            type: "linearGradient",
            colors: [
              {
                opacity: 1,
                offset: 0,
                color: hasOneItem && colorIndex ? selectedColor : "#3b82f6",
              },
              {
                opacity: 0,
                offset: 100,
                color: hasOneItem && colorIndex ? selectedColor : "#3b82f6",
              },
            ],
          },
        ]}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateY: 84,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
          },
        ]}
      />
    </div>
  );
};

export default LineChart;
