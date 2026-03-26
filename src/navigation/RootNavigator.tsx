import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";
import { useOnboardingStore } from "../stores/onboardingStore";
import BottomTabNavigator from "./BottomTabNavigator";
import OnboardingScreen from "../screens/onboarding";
import LoginScreen from "../screens/login";
import LegalScreen from "../screens/legal/LegalScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasSeenOnboarding && (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ animation: "none" }}
        />
      )}
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ presentation: "fullScreenModal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="Legal"
        component={LegalScreen}
        options={{ animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
}
