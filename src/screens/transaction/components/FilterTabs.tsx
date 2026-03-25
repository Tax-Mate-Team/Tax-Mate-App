import { View } from "react-native";
import { Badge } from "../../../components";

type Filter = "all" | "income" | "expense";

type FilterTabsProps = {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
};

export default function FilterTabs({ filter, onFilterChange }: FilterTabsProps) {
  return (
    <View className="flex-row mx-5 mt-5 gap-2">
      {(["all", "income", "expense"] as Filter[]).map((key) => (
        <Badge
          key={key}
          label={key === "all" ? "전체" : key === "income" ? "수입" : "지출"}
          active={filter === key}
          onPress={() => onFilterChange(key)}
        />
      ))}
    </View>
  );
}
