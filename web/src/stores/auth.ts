import { apolloClient } from "@/lib/apollo";
import { LOGIN } from "@/lib/graphql/mutations/login";
import { REGISTER } from "@/lib/graphql/mutations/register";
import type { LoginInput, RegisterInput, User } from "@/data";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type RegisterMutationResponse = {
  register: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

type LoginMutationResponse = {
  login: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  signUp: (data: RegisterInput) => Promise<boolean>;
  login: (data: LoginInput) => Promise<boolean>;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      login: async (data: LoginInput) => {
        try {
          const response = await apolloClient.mutate<LoginMutationResponse>({
            mutation: LOGIN,
            variables: {
              data,
            },
          });

          if (response.data?.login) {
            const { token, refreshToken, user } = response.data.login;

            set({ token, refreshToken, user, isAuthenticated: true });
          }

          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },
      signUp: async (data: RegisterInput) => {
        try {
          const response = await apolloClient.mutate<RegisterMutationResponse>({
            mutation: REGISTER,
            variables: {
              data,
            },
          });

          if (response.data?.register) {
            const { token, refreshToken, user } = response.data.register;

            set({ token, refreshToken, user, isAuthenticated: true });
          }

          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },
      setToken: (token: string) => set({ token }),
      setRefreshToken: (refreshToken: string) => set({ refreshToken }),
      setUser: (user: User) => set({ user }),
      logout: () => {
        set({ token: null, refreshToken: null, user: null, isAuthenticated: false })

        apolloClient.clearStore()
      },
    }),
    {
      name: "auth-storage",
    }
  )
)
