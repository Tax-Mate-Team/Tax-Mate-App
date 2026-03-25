import { View, Text } from "react-native";

const MONTH = new Date().getMonth() + 1;

export default function SummaryCard() {
  return (
    <View className="mx-5 mt-4 bg-primary-600 rounded-3xl p-6">
      <Text className="text-primary-200 text-sm font-medium">{MONTH}월 총 수입</Text>
      <Text className="text-white text-4xl font-bold mt-2">4,500만원</Text>
      <View className="flex-row mt-5 gap-4">
        <View className="flex-1 bg-white/15 rounded-2xl p-4">
          <Text className="text-primary-200 text-xs">원천징수</Text>
          <Text className="text-white text-lg font-bold mt-1">148만 5천</Text>
        </View>
        <View className="flex-1 bg-white/15 rounded-2xl p-4">
          <Text className="text-primary-200 text-xs">실수령</Text>
          <Text className="text-white text-lg font-bold mt-1">4,351만</Text>
        </View>
      </View>
    </View>
  );
}
