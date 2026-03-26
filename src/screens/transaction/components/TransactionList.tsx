import { View, Text } from "react-native";
import { useTheme } from "../../../theme/ThemeContext";
import { Card, TransactionItem, PullToRefresh } from "../../../components";

type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: "income" | "expense";
};

type TransactionListProps = {
  transactions: Transaction[];
  onRefresh: () => Promise<void>;
  isLoggedIn: boolean;
};

export default function TransactionList({ transactions, onRefresh, isLoggedIn }: TransactionListProps) {
  const { t } = useTheme();

  return (
    <View className="flex-1 mt-4">
      <PullToRefresh
        onRefresh={onRefresh}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
      >
        <Card className="overflow-hidden">
          {!isLoggedIn || transactions.length === 0 ? (
            <View className="py-12 items-center">
              <Text style={{ color: t.textMuted }} className="text-sm">
                {isLoggedIn ? "등록된 내역이 없습니다" : "로그인하면 내역을 확인할 수 있어요"}
              </Text>
            </View>
          ) : (
            transactions.map((item, i) => (
              <TransactionItem
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                amount={item.amount}
                type={item.type}
                showBorder={i < transactions.length - 1}
              />
            ))
          )}
        </Card>
      </PullToRefresh>
    </View>
  );
}
