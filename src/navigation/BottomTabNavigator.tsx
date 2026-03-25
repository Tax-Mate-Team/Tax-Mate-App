import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";
import HomeScreen from "../screens/home";
import CalculatorScreen from "../screens/calculator";
import TransactionScreen from "../screens/transaction";
import SettingsScreen from "../screens/settings";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const bottomPadding = Math.max(insets.bottom, 12);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "홈") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "계산기") {
            iconName = focused ? "calculator" : "calculator-outline";
          } else if (route.name === "내역") {
            iconName = focused ? "swap-vertical" : "swap-vertical-outline";
          } else {
            iconName = focused ? "settings" : "settings-outline";
          }

          return (
            <View style={{ alignItems: "center" }}>
              {focused && (
                <View
                  style={{
                    position: "absolute",
                    top: -8,
                    width: 20,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: isDark ? colors.primary[400] : colors.primary[600],
                  }}
                />
              )}
              <Ionicons name={iconName} size={22} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: isDark ? colors.primary[400] : colors.primary[600],
        tabBarInactiveTintColor: isDark ? colors.gray[500] : colors.gray[400],
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isDark ? colors.dark.card : colors.white,
          borderTopWidth: isDark ? 1 : 0,
          borderTopColor: isDark ? colors.dark.border : "transparent",
          height: 56 + bottomPadding,
          paddingTop: 8,
          paddingBottom: bottomPadding,
          shadowColor: isDark ? "transparent" : "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: isDark ? 0 : 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="계산기" component={CalculatorScreen} />
      <Tab.Screen name="내역" component={TransactionScreen} />
      <Tab.Screen name="설정" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
