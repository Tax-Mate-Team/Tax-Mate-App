import "./global.css";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "./src/theme/ThemeContext";
import { ToastProvider } from "./src/contexts/ToastContext";
import { ModalProvider } from "./src/contexts/ModalContext";
import RootNavigator from "./src/navigation/RootNavigator";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { isDark } = useTheme();

  const navTheme = isDark
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: "#0F0F1E", card: "#1E1E36" } }
    : DefaultTheme;

  return (
    <View className={`flex-1 ${isDark ? "dark" : ""}`}>
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
        <StatusBar style={isDark ? "light" : "dark"} />
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ModalProvider>
            <AppContent />
          </ModalProvider>
        </ToastProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
