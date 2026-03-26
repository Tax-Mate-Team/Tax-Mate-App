import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type OnboardingStore = {
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
    }),
    {
      name: "taxmate_onboarding",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
