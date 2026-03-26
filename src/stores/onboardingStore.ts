import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type OnboardingStore = {
  hasSeenOnboarding: boolean;
  hasAgreedTerms: boolean;
  completeOnboarding: () => void;
  agreeTerms: () => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      hasAgreedTerms: false,
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
      agreeTerms: () => set({ hasAgreedTerms: true }),
      reset: () => set({ hasSeenOnboarding: false, hasAgreedTerms: false }),
    }),
    {
      name: "taxmate_onboarding",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
