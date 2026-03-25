import { View } from "react-native";
import { Card, TransactionItem, PullToRefresh } from "../../../components";

type Transaction = {
  id: number;
  title: string;
  subtitle: string;
  amount: number;
  type: "income" | "expense";
};

type TransactionListProps = {
  transactions: Transaction[];
  onRefresh: () => Promise<void>;
};

export default function TransactionList({ transactions, onRefresh }: TransactionListProps) {
  return (
    <View className="flex-1 mt-4">
      <PullToRefresh
        onRefresh={onRefresh}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
      >
        <Card className="overflow-hidden">
          {transactions.map((item, i) => (
            <TransactionItem
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              amount={item.amount}
              type={item.type}
              showBorder={i < transactions.length - 1}
            />
          ))}
        </Card>
      </PullToRefresh>
    </View>
  );
}
