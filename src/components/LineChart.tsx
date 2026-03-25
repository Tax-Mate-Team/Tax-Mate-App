import { View, Text } from "react-native";
import Svg, { Polyline, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop, Rect, Path } from "react-native-svg";
import { colors } from "../theme/tokens";

type LineChartData = {
  label: string;
  value: number;
};

type LineChartProps = {
  data: LineChartData[];
  color?: string;
  title?: string;
  suffix?: string;
};

export default function LineChart({
  data,
  color = colors.primary[500],
  suffix = "만원",
}: LineChartProps) {
  const chartWidth = 300;
  const chartHeight = 120;
  const paddingX = 30;
  const paddingY = 16;
  const graphW = chartWidth - paddingX * 2;
  const graphH = chartHeight - paddingY * 2;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const minVal = Math.min(...data.map((d) => d.value), 0);
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * graphW;
    const y = paddingY + graphH - ((d.value - minVal) / range) * graphH;
    return { x, y, ...d };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Area path
  const areaPath = [
    `M ${points[0].x} ${points[0].y}`,
    ...points.slice(1).map((p) => `L ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${chartHeight - paddingY}`,
    `L ${points[0].x} ${chartHeight - paddingY}`,
    "Z",
  ].join(" ");

  return (
    <View className="items-center">
      <Svg width={chartWidth} height={chartHeight + 24}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.15" />
            <Stop offset="1" stopColor={color} stopOpacity="0.01" />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        {[0, 0.5, 1].map((ratio) => {
          const y = paddingY + graphH - graphH * ratio;
          return (
            <Line
              key={ratio}
              x1={paddingX}
              y1={y}
              x2={chartWidth - paddingX}
              y2={y}
              stroke={colors.gray[100]}
              strokeWidth={1}
            />
          );
        })}

        {/* Gradient area */}
        <Path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <Circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 4 : 3}
            fill={i === points.length - 1 ? color : colors.white}
            stroke={color}
            strokeWidth={2}
          />
        ))}

        {/* X labels */}
        {points.map((p, i) => (
          <SvgText
            key={i}
            x={p.x}
            y={chartHeight + 12}
            fontSize={10}
            fill={colors.gray[400]}
            textAnchor="middle"
          >
            {p.label}
          </SvgText>
        ))}

        {/* Last value label */}
        <Rect
          x={points[points.length - 1].x - 28}
          y={points[points.length - 1].y - 28}
          width={56}
          height={20}
          rx={10}
          fill={color}
        />
        <SvgText
          x={points[points.length - 1].x}
          y={points[points.length - 1].y - 14}
          fontSize={10}
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
        >
          {data[data.length - 1].value.toLocaleString()}{suffix}
        </SvgText>
      </Svg>
    </View>
  );
}
