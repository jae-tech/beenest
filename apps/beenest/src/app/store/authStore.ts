import { api, apiClient } from "@/lib/api-client";
import { handleApiError } from "@/lib/toast";
import type { LoginCredentials } from "@/types";
import type { User } from "@beenest/types";
import { UserRole } from "@beenest/types";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "@/types/api";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (credentials: LoginCredentials) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const loginData: LoginRequest = {
              email: credentials.email,
              password: credentials.password,
            };

            const response = await api.post<any>(
              "/auth/login",
              loginData
            );

            // 백엔드가 직접 로그인 데이터를 반환하므로 response.data가 아닌 response를 사용
            if (!response || !response.user || !response.accessToken) {
              throw new Error("로그인에 실패했습니다.");
            }

            const { user: apiUser, accessToken, refreshToken } = response

            // JWT 토큰 저장
            apiClient.setToken(accessToken);
            apiClient.setRefreshToken(refreshToken);

            // API 사용자 타입을 앱 사용자 타입으로 변환
            const user: User = {
              id: apiUser.id,
              email: apiUser.email,
              name: apiUser.name,
              role: apiUser.role || UserRole.USER,
              createdAt: apiUser.createdAt || new Date().toISOString(),
              updatedAt: apiUser.updatedAt || new Date().toISOString(),
            };

            // 사용자 정보 로컬 스토리지에 저장
            localStorage.setItem("user", JSON.stringify(user));

            set((state) => {
              state.user = user;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.error = null;
            });
          } catch (error: unknown) {
            console.error("Login error:", error);
            const errorMessage =
              (error as any)?.error?.message ||
              (error as any)?.message ||
              "Login failed";
            set((state) => {
              state.isLoading = false;
              state.error = errorMessage;
            });
            handleApiError(error as any);
            throw error;
          }
        },

        register: async (data: RegisterRequest) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response = await api.post<any>(
              "/auth/register",
              data
            );

            // 백엔드가 직접 로그인 데이터를 반환하므로 response.data가 아닌 response를 사용
            if (!response || !response.user || !response.accessToken) {
              throw new Error("회원가입에 실패했습니다.");
            }

            const { user: apiUser, accessToken, refreshToken } = response

            // JWT 토큰 저장
            apiClient.setToken(accessToken);
            apiClient.setRefreshToken(refreshToken);

            // API 사용자 타입을 앱 사용자 타입으로 변환
            const user: User = {
              id: apiUser.id,
              email: apiUser.email,
              name: apiUser.name,
              role: apiUser.role || UserRole.USER,
              createdAt: apiUser.createdAt || new Date().toISOString(),
              updatedAt: apiUser.updatedAt || new Date().toISOString(),
            };

            // 사용자 정보 로컬 스토리지에 저장
            localStorage.setItem("user", JSON.stringify(user));

            set((state) => {
              state.user = user;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.error = null;
            });
          } catch (error: unknown) {
            const errorObj = error as any;
            set((state) => {
              state.isLoading = false;
              state.error =
                errorObj.error?.message || errorObj.message || "Registration failed";
            });
            throw error;
          }
        },

        logout: async () => {
          try {
            // 서버에 로그아웃 요청 (refresh token 무효화)
            const refreshToken = apiClient.getRefreshToken();
            if (refreshToken) {
              await api.post("/auth/logout", { refreshToken });
            }
          } catch (error) {
            // 로그아웃 API 실패해도 로컬 정리는 진행
            console.log("Logout API failed:", error);
          }

          // 토큰 및 사용자 정보 제거
          apiClient.removeToken();
          localStorage.removeItem("user");

          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
          });
        },

        checkAuth: async () => {
          // 이미 인증된 상태라면 중복 요청 방지
          const currentState = useAuthStore.getState();
          if (currentState.isAuthenticated && currentState.user) {
            return;
          }

          const token = apiClient.getToken();
          if (!token || !apiClient.isTokenValid()) {
            // 토큰이 없거나 유효하지 않으면 로그아웃 처리
            set((state) => {
              state.user = null;
              state.isAuthenticated = false;
            });
            return;
          }

          // 이미 로딩 중이라면 중복 요청 방지
          if (currentState.isLoading) {
            return;
          }

          set((state) => {
            state.isLoading = true;
          });

          try {
            const response = await api.get<User>("/auth/me");

            // API는 직접 사용자 객체를 반환함
            if (response && (response as any).id) {
              const apiUser = response as any;
              const user: User = {
                id: apiUser.id,
                email: apiUser.email,
                name: apiUser.name,
                role: apiUser.role || UserRole.USER,
                createdAt: apiUser.createdAt || new Date().toISOString(),
                updatedAt: apiUser.updatedAt || new Date().toISOString(),
              };

              localStorage.setItem("user", JSON.stringify(user));

              set((state) => {
                state.user = user;
                state.isAuthenticated = true;
                state.isLoading = false;
              });
            } else {
              throw new Error("Authentication check failed");
            }
          } catch (_error) {
            // 인증 실패 시 로그아웃 처리
            apiClient.removeToken();
            set((state) => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
            });
          }
        },

        refreshAuth: async () => {
          const refreshToken = apiClient.getRefreshToken();
          if (!refreshToken) return;

          try {
            const response = await api.post<any>("/auth/refresh", {
              refreshToken,
              deviceId: localStorage.getItem('device_id'),
            });

            // 백엔드가 직접 로그인 데이터를 반환하므로 response.data가 아닌 response를 사용
            if (!response || !response.user || !response.accessToken) {
              throw new Error("토큰 갱신에 실패했습니다.");
            }

            const { user: apiUser, accessToken, refreshToken: newRefreshToken } = response

            // 새 토큰 저장
            apiClient.setToken(accessToken);
            apiClient.setRefreshToken(newRefreshToken);

            const user: User = {
              id: apiUser.id,
              email: apiUser.email,
              name: apiUser.name,
              role: apiUser.role || UserRole.USER,
              createdAt: apiUser.createdAt || new Date().toISOString(),
              updatedAt: apiUser.updatedAt || new Date().toISOString(),
            };

            localStorage.setItem("user", JSON.stringify(user));

            set((state) => {
              state.user = user;
              state.isAuthenticated = true;
            });
          } catch (_error) {
            // 리프레시 실패 시 로그아웃
            apiClient.removeToken();
            set((state) => {
              state.user = null;
              state.isAuthenticated = false;
            });
          }
        },

        setUser: (user: User) => {
          set((state) => {
            state.user = user;
            state.isAuthenticated = true;
          });
        },

        setLoading: (loading: boolean) => {
          set((state) => {
            state.isLoading = loading;
          });
        },

        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },
      })),
      {
        name: "auth-store",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "auth-store" }
  )
);
