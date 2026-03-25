import { View, Text, Pressable } from "react-native";
import { useTheme } from "../../../theme/ThemeContext";
import { Card, TransactionItem } from "../../../components";

const RECENT_ITEMS = [
  { id: 1, title: "웹 개발 외주", subtitle: "ABC 스타트업 · 3월 20일", amount: 3000000, type: "income" as const },
  { id: 2, title: "노트북 구매", subtitle: "경비 · 3월 18일", amount: 1200000, type: "expense" as const },
  { id: 3, title: "앱 유지보수", subtitle: "XYZ 컴퍼니 · 3월 15일", amount: 1500000, type: "income" as const },
  { id: 4, title: "교통비", subtitle: "경비 · 3월 14일", amount: 45000, type: "expense" as const },
];

export default function RecentTransactions() {
  const { t } = useTheme();

  return (
    <View className="mx-5 mt-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text style={{ color: t.text }} className="text-lg font-bold">최근 내역</Text>
        <Pressable className="active:opacity-60">
          <Text style={{ color: t.primaryText }} className="text-sm font-semibold">전체 보기</Text>
        </Pressable>
      </View>
      <Card className="overflow-hidden">
        {RECENT_ITEMS.map((item, i) => (
          <TransactionItem
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            amount={item.amount}
            type={item.type}
            showBorder={i < RECENT_ITEMS.length - 1}
          />
        ))}
      </Card>
    </View>
  );
}
