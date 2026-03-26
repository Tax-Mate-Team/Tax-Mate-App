import { View, Text } from "react-native";
import { useTheme } from "../../../theme/ThemeContext";
import { Card, TransactionItem } from "../../../components";

type Item = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: "income" | "expense";
};

type RecentTransactionsProps = {
  items: Item[];
  isLoggedIn: boolean;
};

export default function RecentTransactions({ items, isLoggedIn }: RecentTransactionsProps) {
  const { t } = useTheme();

  return (
    <View className="mx-5 mt-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text style={{ color: t.text }} className="text-lg font-bold">최근 내역</Text>
      </View>
      <Card className="overflow-hidden">
        {!isLoggedIn || items.length === 0 ? (
          <View className="py-8 items-center">
            <Text style={{ color: t.textMuted }} className="text-sm">
              {isLoggedIn ? "등록된 내역이 없습니다" : "로그인하면 내역을 확인할 수 있어요"}
            </Text>
          </View>
        ) : (
          items.map((item, i) => (
            <TransactionItem
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              amount={item.amount}
              type={item.type}
              showBorder={i < items.length - 1}
            />
          ))
        )}
      </Card>
    </View>
  );
}
