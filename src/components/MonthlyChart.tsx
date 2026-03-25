import { View, Text } from "react-native";
import Svg, { Rect, Line, Text as SvgText } from "react-native-svg";
import { colors } from "../theme/tokens";

type ChartData = {
  month: string;
  income: number;
  expense: number;
};

type MonthlyChartProps = {
  data: ChartData[];
};

export default function MonthlyChart({ data }: MonthlyChartProps) {
  const chartWidth = 300;
  const chartHeight = 140;
  const barWidth = 14;
  const gap = 6;
  const pairWidth = barWidth * 2 + gap;
  const maxValue = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1);

  const totalPairWidth = pairWidth + 16;
  const startX = (chartWidth - totalPairWidth * data.length) / 2 + 8;

  return (
    <View className="items-center">
      <Svg width={chartWidth} height={chartHeight + 30}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = chartHeight - chartHeight * ratio;
          return (
            <Line
              key={ratio}
              x1={0}
              y1={y}
              x2={chartWidth}
              y2={y}
              stroke={colors.gray[100]}
              strokeWidth={1}
            />
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = startX + i * totalPairWidth;
          const incomeH = (d.income / maxValue) * chartHeight;
          const expenseH = (d.expense / maxValue) * chartHeight;

          return (
            <View key={d.month}>
              {/* Income bar */}
              <Rect
                x={x}
                y={chartHeight - incomeH}
                width={barWidth}
                height={incomeH}
                rx={4}
                fill={colors.primary[500]}
              />
              {/* Expense bar */}
              <Rect
                x={x + barWidth + gap}
                y={chartHeight - expenseH}
                width={barWidth}
                height={expenseH}
                rx={4}
                fill={colors.danger[400]}
              />
              {/* Month label */}
              <SvgText
                x={x + pairWidth / 2}
                y={chartHeight + 18}
                fontSize={11}
                fill={colors.gray[400]}
                textAnchor="middle"
              >
                {d.month}
              </SvgText>
            </View>
          );
        })}
      </Svg>

      {/* Legend */}
      <View className="flex-row gap-5 mt-2">
        <View className="flex-row items-center gap-1.5">
          <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.primary[500] }} />
          <Text className="text-gray-400 text-xs">수입</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.danger[400] }} />
          <Text className="text-gray-400 text-xs">지출</Text>
        </View>
      </View>
    </View>
  );
}
