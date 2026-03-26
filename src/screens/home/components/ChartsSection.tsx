import { View, Text } from "react-native";
import { colors } from "../../../theme/tokens";
import { useTheme } from "../../../theme/ThemeContext";
import { Card, LineChart, MonthlyChart, DonutChart } from "../../../components";
import type { IncomeResponse } from "../../../api/generated/model/incomeResponse";
import type { ExpenseResponse } from "../../../api/generated/model/expenseResponse";

type ChartsSectionProps = {
  section: "line" | "bar" | "donut";
  incomes: IncomeResponse[];
  expenses: ExpenseResponse[];
  isLoggedIn: boolean;
};

const MONTH_LABELS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

function buildMonthlyData(incomes: IncomeResponse[], expenses: ExpenseResponse[]) {
  const months: Record<number, { income: number; expense: number }> = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth() + 1;
    months[m] = { income: 0, expense: 0 };
  }
  incomes.forEach((inc) => {
    const m = new Date(inc.incomeDate).getMonth() + 1;
    if (months[m]) months[m].income += inc.amount;
  });
  expenses.forEach((exp) => {
    const m = new Date(exp.expenseDate).getMonth() + 1;
    if (months[m]) months[m].expense += exp.amount;
  });
  return Object.entries(months).map(([m, d]) => ({
    month: MONTH_LABELS[parseInt(m) - 1],
    income: Math.round(d.income / 10000),
    expense: Math.round(d.expense / 10000),
  }));
}

function buildExpenseCategories(expenses: ExpenseResponse[]) {
  const catColors: Record<string, string> = {
    EQUIPMENT: colors.primary[500],
    TRANSPORT: colors.success[500],
    OFFICE_SUPPLY: colors.warning[500],
    TELECOM: colors.purple[500],
    MEAL: colors.danger[400],
    SOFTWARE: colors.primary[400],
    EDUCATION: colors.success[400],
    RENT: colors.gray[500],
    OUTSOURCING: colors.primary[700],
    TAX: colors.danger[500],
    INSURANCE: colors.warning[500],
    ETC: colors.gray[400],
  };
  const map: Record<string, { label: string; value: number; color: string }> = {};
  expenses.forEach((e) => {
    if (!map[e.category]) {
      map[e.category] = { label: e.categoryDisplayName, value: 0, color: catColors[e.category] || colors.gray[400] };
    }
    map[e.category].value += e.amount;
  });
  return Object.values(map).sort((a, b) => b.value - a.value);
}

// fallback mock data for logged-out state
const MOCK_BAR = [
  { month: "10월", income: 2800, expense: 400 },
  { month: "11월", income: 3200, expense: 600 },
  { month: "12월", income: 2500, expense: 350 },
  { month: "1월", income: 4100, expense: 800 },
  { month: "2월", income: 3800, expense: 500 },
  { month: "3월", income: 4500, expense: 1245 },
];
const MOCK_LINE = [
  { label: "10월", value: 2400 },
  { label: "11월", value: 2600 },
  { label: "12월", value: 2150 },
  { label: "1월", value: 3300 },
  { label: "2월", value: 3300 },
  { label: "3월", value: 3255 },
];
const MOCK_DONUT = [
  { label: "장비", value: 1200000, color: colors.primary[500] },
  { label: "교통", value: 245000, color: colors.success[500] },
  { label: "사무", value: 135000, color: colors.warning[500] },
  { label: "통신", value: 155000, color: colors.purple[500] },
  { label: "식비", value: 310000, color: colors.danger[400] },
];

export default function ChartsSection({ section, incomes, expenses, isLoggedIn }: ChartsSectionProps) {
  const { t } = useTheme();

  const barData = isLoggedIn ? buildMonthlyData(incomes, expenses) : MOCK_BAR;
  const lineData = isLoggedIn
    ? barData.map((d) => ({ label: d.month, value: d.income - d.expense }))
    : MOCK_LINE;

  if (section === "line") {
    return (
      <Card className="mx-5 mt-5 p-5">
        <View className="flex-row justify-between items-center mb-4">
          <Text style={{ color: t.text }} className="text-lg font-bold">누적 순수익</Text>
          <Text style={{ color: t.textMuted }} className="text-xs">최근 6개월</Text>
        </View>
        <LineChart data={lineData} color={colors.primary[500]} suffix="만" />
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
        <MonthlyChart data={barData} />
      </Card>
    );
  }

  const donutData = isLoggedIn ? buildExpenseCategories(expenses) : MOCK_DONUT;
  const totalExpense = donutData.reduce((s, d) => s + d.value, 0);
  const centerValue = totalExpense >= 10000
    ? `${Math.round(totalExpense / 10000)}만`
    : `${totalExpense.toLocaleString()}`;

  return (
    <Card className="mx-5 mt-4 p-5">
      <Text style={{ color: t.text }} className="text-lg font-bold mb-4">지출 카테고리</Text>
      <DonutChart data={donutData} centerLabel="총 지출" centerValue={centerValue} />
    </Card>
  );
}
