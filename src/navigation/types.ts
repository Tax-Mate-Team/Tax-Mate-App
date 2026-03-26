export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Login: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
