import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "../api/client";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  memberId: string | null;
  email: string | null;
  nickname: string | null;
};

type AuthStore = AuthState & {
  isLoggedIn: boolean;
  user: { memberId: string; email: string; nickname: string } | null;
  setAuth: (state: AuthState) => void;
  logout: () => void;
  _hasHydrated: boolean;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      memberId: null,
      email: null,
      nickname: null,
      isLoggedIn: false,
      user: null,
      _hasHydrated: false,

      setAuth: (state) => {
        if (state.accessToken) {
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${state.accessToken}`;
        }
        set({
          ...state,
          isLoggedIn: !!state.accessToken,
          user:
            state.memberId && state.email && state.nickname
              ? { memberId: state.memberId, email: state.email, nickname: state.nickname }
              : null,
        });
      },

      logout: () => {
        delete axiosInstance.defaults.headers.common.Authorization;
        set({
          accessToken: null,
          refreshToken: null,
          memberId: null,
          email: null,
          nickname: null,
          isLoggedIn: false,
          user: null,
        });
      },
    }),
    {
      name: "taxmate_auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        memberId: state.memberId,
        email: state.email,
        nickname: state.nickname,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.accessToken) {
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${state.accessToken}`;
          }
          state.isLoggedIn = !!state.accessToken;
          state.user =
            state.memberId && state.email && state.nickname
              ? { memberId: state.memberId, email: state.email, nickname: state.nickname }
              : null;
          state._hasHydrated = true;
        }
      },
    },
  ),
);
