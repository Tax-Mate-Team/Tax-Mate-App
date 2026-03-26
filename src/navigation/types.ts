export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Login: undefined;
  Legal: { type: "terms" | "privacy" };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
