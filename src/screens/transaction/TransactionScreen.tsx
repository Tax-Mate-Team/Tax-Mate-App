import { useState } from "react";
import { View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows } from "../../theme/tokens";
import { useTheme } from "../../theme/ThemeContext";
import { ScreenHeader, FadeIn } from "../../components";
import SummaryPills from "./components/SummaryPills";
import FilterTabs from "./components/FilterTabs";
import TransactionList from "./components/TransactionList";

type Filter = "all" | "income" | "expense";

const TRANSACTIONS = [
  { id: 1, title: "웹 개발 외주", subtitle: "ABC 스타트업 · 개발 · 3월 20일", amount: 3000000, type: "income" as const },
  { id: 2, title: "노트북 구매", subtitle: "장비 · 3월 18일", amount: 1200000, type: "expense" as const },
  { id: 3, title: "앱 유지보수", subtitle: "XYZ 컴퍼니 · 개발 · 3월 15일", amount: 1500000, type: "income" as const },
  { id: 4, title: "교통비", subtitle: "교통 · 3월 14일", amount: 45000, type: "expense" as const },
  { id: 5, title: "디자인 작업", subtitle: "DEF 에이전시 · 디자인 · 3월 10일", amount: 2000000, type: "income" as const },
  { id: 6, title: "사무용품", subtitle: "사무 · 3월 8일", amount: 35000, type: "expense" as const },
  { id: 7, title: "컨설팅", subtitle: "GHI 기업 · 컨설팅 · 3월 5일", amount: 800000, type: "income" as const },
  { id: 8, title: "통신비", subtitle: "통신 · 3월 3일", amount: 55000, type: "expense" as const },
];

async function fakeRefresh() {
  return new Promise<void>((r) => setTimeout(r, 1200));
}

export default function TransactionScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>("all");
  const { t } = useTheme();

  const filtered = TRANSACTIONS.filter((t) => filter === "all" || t.type === filter);
  const totalIncome = TRANSACTIONS.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = TRANSACTIONS.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <View className="flex-1" style={{ backgroundColor: t.bg, paddingTop: insets.top }}>
      <ScreenHeader title="수입 · 지출" />
      <FadeIn delay={0}><SummaryPills totalIncome={totalIncome} totalExpense={totalExpense} /></FadeIn>
      <FadeIn delay={100}><FilterTabs filter={filter} onFilterChange={setFilter} /></FadeIn>
      <FadeIn delay={200} style={{ flex: 1 }}><TransactionList transactions={filtered} onRefresh={fakeRefresh} /></FadeIn>

      <View style={{ position: "absolute", bottom: 100, right: 20 }}>
        <Pressable
          className="w-14 h-14 bg-primary-600 rounded-full items-center justify-center active:bg-primary-700"
          style={shadows.colored(colors.primary[600])}
        >
          <Ionicons name="add" size={28} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
