import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../theme/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { Button } from "../../../components";

type SaveCTAProps = {
  onReset: () => void;
};

export default function SaveCTA({ onReset }: SaveCTAProps) {
  const { isDark } = useTheme();
  const { isLoggedIn } = useAuth();
  const navigation = useNavigation();

  return (
    <>
      {!isLoggedIn && (
        <View
          className="mx-5 mt-4 rounded-3xl p-5 flex-row items-center"
          style={{ backgroundColor: isDark ? "#E2E8F0" : "#111827" }}
        >
          <View className="flex-1">
            <Text className="text-base font-bold" style={{ color: isDark ? "#111827" : "#FFFFFF" }}>이 기록을 저장할까요?</Text>
            <Text className="text-xs mt-1" style={{ color: isDark ? "#64748B" : "#9CA3AF" }}>로그인하면 내역을 관리할 수 있어요</Text>
          </View>
          <View>
            <Button title="로그인" variant="secondary" size="sm" onPress={() => navigation.navigate("Login")} />
          </View>
        </View>
      )}

      <View className="mx-5 mt-3">
        <Button title="다시 계산하기" variant="ghost" onPress={onReset} />
      </View>
    </>
  );
}
