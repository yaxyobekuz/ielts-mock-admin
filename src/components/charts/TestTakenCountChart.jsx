import { ResponsiveLine } from "@nivo/line";

const TestTakenCountChart = ({
  data,
  className = "",
  color = "#3b82f6",
  gradientId = "gradientA",
}) => {
  return (
    <div className={className}>
      <ResponsiveLine
        data={data}
        legends={[]}
        axisTop={null}
        lineWidth={2.5}
        axisLeft={null}
        curve="cardinal"
        colors={[color]}
        axisRight={null}
        enableArea={true}
        areaOpacity={0.5}
        axisBottom={null}
        enableGridX={false}
        enableGridY={false}
        enablePoints={false}
        margin={{ top: 6, bottom: 6 }}
        defs={[
          {
            id: gradientId,
            type: "linearGradient",
            colors: [
              { offset: 0, color, opacity: 0.4 },
              { offset: 100, color, opacity: 0 },
            ],
          },
        ]}
        fill={[{ match: "*", id: gradientId }]}
      />
    </div>
  );
};

export default TestTakenCountChart;
