import { ResponsiveLine } from "@nivo/line";

const data = [
  {
    id: "Umumiy",
    data: [
      { x: "Du", y: 10 },
      { x: "Se", y: 5 },
      { x: "Pay", y: 11 },
      { x: "Ju", y: 2 },
      { x: "Sha", y: 20 },
      { x: "Yak", y: 16 },
    ],
  },
];

const LineChart = ({ className = "" }) => (
  <div className={className}>
    <ResponsiveLine
      data={data}
      pointSize={6}
      useMesh={true}
      lineWidth={2.5}
      curve="cardinal"
      enableGridX={false}
      pointBorderWidth={2}
      xScale={{ type: "point" }}
      pointColor={{ theme: "background" }}
      pointBorderColor={{ from: "serie.color" }}
      margin={{ top: 12, right: 32, bottom: 32, left: 52 }}
      axisLeft={{ legend: "Test yechishlar", legendOffset: -36 }}
      yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
      // Gradient color
      enableArea={true}
      areaOpacity={0.5}
      colors={["#3b82f6"]}
      fill={[{ match: "*", id: "gradientA" }]}
      defs={[
        {
          id: "gradientA",
          type: "linearGradient",
          colors: [
            { offset: 0, color: "#3b82f6", opacity: 0.4 },
            { offset: 100, color: "#3b82f6", opacity: 0 },
          ],
        },
      ]}
    />
  </div>
);

export default LineChart;
