import { View, Text } from "react-native";

const MONTH = new Date().getMonth() + 1;

function fmt(n?: number) {
  if (n == null) return "-";
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(0)}만원`;
  return `${n.toLocaleString()}원`;
}

type SummaryCardProps = {
  totalIncome?: number;
  totalWithholdingTax?: number;
  netProfit?: number;
  isLoggedIn: boolean;
};

export default function SummaryCard({ totalIncome, totalWithholdingTax, netProfit, isLoggedIn }: SummaryCardProps) {
  return (
    <View className="mx-5 mt-4 bg-primary-600 rounded-3xl p-6">
      <Text className="text-primary-200 text-sm font-medium">{MONTH}월 총 수입</Text>
      <Text className="text-white text-4xl font-bold mt-2">
        {isLoggedIn ? fmt(totalIncome) : "로그인 필요"}
      </Text>
      <View className="flex-row mt-5 gap-4">
        <View className="flex-1 bg-white/15 rounded-2xl p-4">
          <Text className="text-primary-200 text-xs">원천징수</Text>
          <Text className="text-white text-lg font-bold mt-1">
            {isLoggedIn ? fmt(totalWithholdingTax) : "-"}
          </Text>
        </View>
        <View className="flex-1 bg-white/15 rounded-2xl p-4">
          <Text className="text-primary-200 text-xs">순수익</Text>
          <Text className="text-white text-lg font-bold mt-1">
            {isLoggedIn ? fmt(netProfit) : "-"}
          </Text>
        </View>
      </View>
    </View>
  );
}
