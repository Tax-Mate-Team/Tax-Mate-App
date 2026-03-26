import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "../../theme/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { ScreenHeader, PullToRefresh, FadeIn } from "../../components";
import {
  useGetMonthlySummary,
  getGetMonthlySummaryQueryKey,
} from "../../api/generated/대시보드/대시보드";
import {
  useGetIncomes,
  getGetIncomesQueryKey,
} from "../../api/generated/수입-관리/수입-관리";
import {
  useGetExpenses,
  getGetExpensesQueryKey,
} from "../../api/generated/지출-관리/지출-관리";
import SummaryCard from "./components/SummaryCard";
import QuickActions from "./components/QuickActions";
import ChartsSection from "./components/ChartsSection";
import MonthlySummary from "./components/MonthlySummary";
import RecentTransactions from "./components/RecentTransactions";

const now = new Date();
const YEAR = now.getFullYear();
const MONTH = now.getMonth() + 1;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTheme();
  const { isLoggedIn, user } = useAuth();
  const queryClient = useQueryClient();

  const summaryQuery = useGetMonthlySummary(
    { year: YEAR, month: MONTH },
    { query: { enabled: isLoggedIn } }
  );

  const incomesQuery = useGetIncomes(
    { year: YEAR, month: MONTH },
    { query: { enabled: isLoggedIn } }
  );

  const expensesQuery = useGetExpenses(
    { year: YEAR, month: MONTH },
    { query: { enabled: isLoggedIn } }
  );

  const summary = summaryQuery.data?.data;
  const incomes = incomesQuery.data?.data ?? [];
  const expenses = expensesQuery.data?.data ?? [];

  const recentItems = [
    ...incomes.map((i) => ({
      id: i.id,
      title: i.clientName || "수입",
      subtitle: i.incomeDate,
      amount: i.amount,
      type: "income" as const,
    })),
    ...expenses.map((e) => ({
      id: e.id,
      title: e.title,
      subtitle: `${e.categoryDisplayName} · ${e.expenseDate}`,
      amount: e.amount,
      type: "expense" as const,
    })),
  ]
    .sort((a, b) => b.subtitle.localeCompare(a.subtitle))
    .slice(0, 5);

  const handleRefresh = async () => {
    if (!isLoggedIn) return;
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getGetMonthlySummaryQueryKey(),
      }),
      queryClient.invalidateQueries({ queryKey: getGetIncomesQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getGetExpensesQueryKey() }),
    ]);
  };

  const greeting = user ? `${user.nickname}님의 수입 현황` : "회원님";

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 100 }}
      style={{ backgroundColor: t.bg }}
    >
      <ScreenHeader greeting="안녕하세요" title={greeting} />
      <FadeIn delay={0}>
        <SummaryCard
          totalIncome={summary?.totalIncome}
          totalWithholdingTax={summary?.totalWithholdingTax}
          netProfit={summary?.netProfit}
          isLoggedIn={isLoggedIn}
        />
      </FadeIn>
      <FadeIn delay={80}>
        <QuickActions />
      </FadeIn>
      <FadeIn delay={160}>
        <ChartsSection
          section="line"
          incomes={incomes}
          expenses={expenses}
          isLoggedIn={isLoggedIn}
        />
      </FadeIn>
      <FadeIn delay={240}>
        <ChartsSection
          section="bar"
          incomes={incomes}
          expenses={expenses}
          isLoggedIn={isLoggedIn}
        />
      </FadeIn>
      <FadeIn delay={320}>
        <ChartsSection
          section="donut"
          incomes={incomes}
          expenses={expenses}
          isLoggedIn={isLoggedIn}
        />
      </FadeIn>
      <FadeIn delay={400}>
        <MonthlySummary
          totalIncome={summary?.totalIncome}
          totalExpense={summary?.totalExpense}
          netProfit={summary?.netProfit}
          isLoggedIn={isLoggedIn}
        />
      </FadeIn>
      <FadeIn delay={480}>
        <RecentTransactions items={recentItems} isLoggedIn={isLoggedIn} />
      </FadeIn>
    </PullToRefresh>
  );
}
