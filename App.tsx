import "./global.css";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";

function AppContent() {
  const { isDark } = useTheme();

  const navTheme = isDark
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: "#0F0F1E", card: "#1E1E36" } }
    : DefaultTheme;

  return (
    <View className={`flex-1 ${isDark ? "dark" : ""}`}>
      <NavigationContainer theme={navTheme}>
        <BottomTabNavigator />
        <StatusBar style={isDark ? "light" : "dark"} />
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
