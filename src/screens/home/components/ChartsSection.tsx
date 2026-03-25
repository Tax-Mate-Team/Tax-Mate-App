import { View, Text } from "react-native";
import { colors } from "../../../theme/tokens";
import { useTheme } from "../../../theme/ThemeContext";
import { Card, LineChart, MonthlyChart, DonutChart } from "../../../components";

const BAR_CHART_DATA = [
  { month: "10월", income: 2800, expense: 400 },
  { month: "11월", income: 3200, expense: 600 },
  { month: "12월", income: 2500, expense: 350 },
  { month: "1월", income: 4100, expense: 800 },
  { month: "2월", income: 3800, expense: 500 },
  { month: "3월", income: 4500, expense: 1245 },
];

const LINE_CHART_DATA = [
  { label: "10월", value: 2400 },
  { label: "11월", value: 2600 },
  { label: "12월", value: 2150 },
  { label: "1월", value: 3300 },
  { label: "2월", value: 3300 },
  { label: "3월", value: 3255 },
];

const EXPENSE_CATEGORIES = [
  { label: "장비", value: 1200000, color: colors.primary[500] },
  { label: "교통", value: 245000, color: colors.success[500] },
  { label: "사무", value: 135000, color: colors.warning[500] },
  { label: "통신", value: 155000, color: colors.purple[500] },
  { label: "식비", value: 310000, color: colors.danger[400] },
];

type ChartsSectionProps = {
  section: "line" | "bar" | "donut";
};

export default function ChartsSection({ section }: ChartsSectionProps) {
  const { t } = useTheme();

  if (section === "line") {
    return (
      <Card className="mx-5 mt-5 p-5">
        <View className="flex-row justify-between items-center mb-4">
          <Text style={{ color: t.text }} className="text-lg font-bold">누적 순수익</Text>
          <Text style={{ color: t.textMuted }} className="text-xs">최근 6개월</Text>
        </View>
        <LineChart data={LINE_CHART_DATA} color={colors.primary[500]} suffix="만" />
      </Card>
    );
  }

  if (section === "bar") {
    return (
      <Card className="mx-5 mt-4 p-5">
        <View className="flex-row justify-between items-center mb-4">
          <Text style={{ color: t.text }} className="text-lg font-bold">월별 수입 · 지출</Text>
          <Text style={{ color: t.textMuted }} className="text-xs">최근 6개월</Text>
        </View>
        <MonthlyChart data={BAR_CHART_DATA} />
      </Card>
    );
  }

  return (
    <Card className="mx-5 mt-4 p-5">
      <Text style={{ color: t.text }} className="text-lg font-bold mb-4">지출 카테고리</Text>
      <DonutChart data={EXPENSE_CATEGORIES} centerLabel="총 지출" centerValue="204만" />
    </Card>
  );
}
