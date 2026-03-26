import { useState } from "react";
import { View } from "react-native";
import Svg, { Polyline, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop, Path } from "react-native-svg";
import { colors } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";

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

function niceRound(val: number): string {
  if (val >= 10000) return `${(val / 10000).toFixed(0)}억`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}천`;
  return `${val}`;
}

export default function LineChart({
  data,
  color = colors.primary[500],
  suffix = "만",
}: LineChartProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const { isDark } = useTheme();

  const chartWidth = containerWidth;
  const chartHeight = 140;
  const paddingLeft = 36;
  const paddingRight = 8;
  const paddingTop = 12;
  const paddingBottom = 24;
  const graphW = chartWidth - paddingLeft - paddingRight;
  const graphH = chartHeight - paddingTop - paddingBottom;

  if (data.length < 2 || chartWidth === 0) {
    return (
      <View
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        style={{ height: chartHeight + 24 }}
      />
    );
  }

  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const valRange = maxVal - minVal || 1;
  const topPad = valRange * 0.1;
  const scaleMin = minVal - topPad;
  const scaleMax = maxVal + topPad;
  const scaleRange = scaleMax - scaleMin;

  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * graphW;
    const y = paddingTop + graphH - ((d.value - scaleMin) / scaleRange) * graphH;
    return { x, y, ...d };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  const areaPath = [
    `M ${points[0].x} ${points[0].y}`,
    ...points.slice(1).map((p) => `L ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${paddingTop + graphH}`,
    `L ${points[0].x} ${paddingTop + graphH}`,
    "Z",
  ].join(" ");

  const gridColor = isDark ? "#2D2D4A" : colors.gray[100];
  const labelColor = isDark ? "#64748B" : colors.gray[400];

  // Y축 라벨 3개 (하단, 중간, 상단)
  const yTicks = [0, 0.5, 1].map((ratio) => {
    const val = Math.round(scaleMin + scaleRange * ratio);
    const y = paddingTop + graphH - graphH * ratio;
    return { val, y };
  });

  return (
    <View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      <Svg width={chartWidth} height={chartHeight + 24}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.2" />
            <Stop offset="1" stopColor={color} stopOpacity="0.01" />
          </LinearGradient>
        </Defs>

        {/* Grid lines + Y축 라벨 */}
        {yTicks.map((tick, i) => (
          <View key={i}>
            <Line
              x1={paddingLeft}
              y1={tick.y}
              x2={chartWidth - paddingRight}
              y2={tick.y}
              stroke={gridColor}
              strokeWidth={1}
            />
            <SvgText
              x={paddingLeft - 6}
              y={tick.y + 3.5}
              fontSize={9}
              fill={labelColor}
              textAnchor="end"
            >
              {niceRound(tick.val)}{suffix}
            </SvgText>
          </View>
        ))}

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
            r={i === points.length - 1 ? 4.5 : 3}
            fill={i === points.length - 1 ? color : isDark ? "#1E1E36" : colors.white}
            stroke={color}
            strokeWidth={2}
          />
        ))}

        {/* X labels */}
        {points.map((p, i) => (
          <SvgText
            key={i}
            x={p.x}
            y={chartHeight + 14}
            fontSize={10}
            fill={labelColor}
            textAnchor="middle"
          >
            {p.label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
