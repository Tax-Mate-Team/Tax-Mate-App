import { View, Text } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useTheme } from "../theme/ThemeContext";

type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  data: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
};

export default function DonutChart({ data, size = 140, strokeWidth = 18, centerLabel, centerValue }: DonutChartProps) {
  const { t } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const center = size / 2;

  let accumulatedOffset = 0;

  return (
    <View className="items-center">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle cx={center} cy={center} r={radius} stroke={t.border} strokeWidth={strokeWidth} fill="none" />
          <G rotation="-90" origin={`${center}, ${center}`}>
            {data.map((segment, i) => {
              const pct = segment.value / total;
              const dash = circumference * pct;
              const gap = circumference - dash;
              const offset = accumulatedOffset;
              accumulatedOffset += dash;
              return (
                <Circle key={i} cx={center} cy={center} r={radius} stroke={segment.color} strokeWidth={strokeWidth} strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset} strokeLinecap="round" fill="none" />
              );
            })}
          </G>
        </Svg>
        {(centerLabel || centerValue) && (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
            {centerLabel && <Text style={{ color: t.textMuted }} className="text-xs">{centerLabel}</Text>}
            {centerValue && <Text style={{ color: t.text }} className="text-lg font-bold mt-0.5">{centerValue}</Text>}
          </View>
        )}
      </View>
      <View className="flex-row flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3">
        {data.map((segment) => (
          <View key={segment.label} className="flex-row items-center gap-1.5">
            <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
            <Text style={{ color: t.textSecondary }} className="text-xs">
              {segment.label} {Math.round((segment.value / total) * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
