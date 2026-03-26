import { useState } from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows } from "../../theme/tokens";
import { useTheme } from "../../theme/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useModal } from "../../contexts/ModalContext";
import { ScreenHeader, FadeIn } from "../../components";
import { useGetIncomes, getGetIncomesQueryKey } from "../../api/generated/수입-관리/수입-관리";
import { useGetExpenses, getGetExpensesQueryKey } from "../../api/generated/지출-관리/지출-관리";
import SummaryPills from "./components/SummaryPills";
import FilterTabs from "./components/FilterTabs";
import TransactionList from "./components/TransactionList";
import AddIncomeModal from "../modals/AddIncomeModal";
import AddExpenseModal from "../modals/AddExpenseModal";

type Filter = "all" | "income" | "expense";

const now = new Date();
const YEAR = now.getFullYear();
const MONTH = now.getMonth() + 1;

export default function TransactionScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>("all");
  const { t } = useTheme();
  const { isLoggedIn } = useAuth();
  const { openModal } = useModal();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const incomesQuery = useGetIncomes(
    { year: YEAR, month: MONTH },
    { query: { enabled: isLoggedIn } },
  );
  const expensesQuery = useGetExpenses(
    { year: YEAR, month: MONTH },
    { query: { enabled: isLoggedIn } },
  );

  const incomes = incomesQuery.data?.data ?? [];
  const expenses = expensesQuery.data?.data ?? [];

  const transactions = [
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
  ].sort((a, b) => b.subtitle.localeCompare(a.subtitle));

  const filtered = transactions.filter((t) => filter === "all" || t.type === filter);
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);

  const handleRefresh = async () => {
    if (!isLoggedIn) return;
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: getGetIncomesQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getGetExpensesQueryKey() }),
    ]);
  };

  const handleAdd = () => {
    if (!isLoggedIn) {
      navigation.navigate("Login");
      return;
    }
    if (filter === "expense") {
      openModal(AddExpenseModal);
    } else {
      openModal(AddIncomeModal);
    }
  };

  const isLoading = incomesQuery.isLoading || expensesQuery.isLoading;

  return (
    <View className="flex-1" style={{ backgroundColor: t.bg, paddingTop: insets.top }}>
      <ScreenHeader title="수입 · 지출" />
      <FadeIn delay={0}><SummaryPills totalIncome={totalIncome} totalExpense={totalExpense} /></FadeIn>
      <FadeIn delay={100}><FilterTabs filter={filter} onFilterChange={setFilter} /></FadeIn>
      <FadeIn delay={200} style={{ flex: 1 }}>
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={t.primary} />
          </View>
        ) : (
          <TransactionList
            transactions={filtered}
            onRefresh={handleRefresh}
            isLoggedIn={isLoggedIn}
          />
        )}
      </FadeIn>

      <View style={{ position: "absolute", bottom: 100, right: 20 }}>
        <Pressable
          onPress={handleAdd}
          className="w-14 h-14 bg-primary-600 rounded-full items-center justify-center active:bg-primary-700"
          style={shadows.colored(colors.primary[600])}
        >
          <Ionicons name="add" size={28} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
