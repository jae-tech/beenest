import { api, apiClient } from "@/lib/api-client";
import { handleApiError } from "@/lib/toast";
import type { LoginCredentials, User } from "@/types";
import type {
  User as ApiUser,
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

            const response = await api.post<LoginResponse>(
              "/auth/login",
              loginData
            );

            // API는 직접 {user, accessToken, refreshToken, token} 형식으로 응답함
            const { user: apiUser, accessToken, refreshToken, token } = response as any;

            // JWT 토큰 저장 (신규 형식 우선, 기존 호환성 유지)
            apiClient.setToken(accessToken || token);
            if (refreshToken) {
              apiClient.setRefreshToken(refreshToken);
            }

            // API 사용자 타입을 앱 사용자 타입으로 변환
            const user: User = {
              id: apiUser.id,
              email: apiUser.email,
              name: apiUser.name,
              role: "admin", // 기본값으로 설정, 필요시 API 스키마 확장
              avatar: undefined,
              lastLogin: new Date().toISOString(),
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
            handleApiError(error);
            throw error;
          }
        },

        register: async (data: RegisterRequest) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response = await api.post<LoginResponse>(
              "/auth/register",
              data
            );

            // API는 직접 {user, accessToken, refreshToken, token} 형식으로 응답함
            const { user: apiUser, accessToken, refreshToken, token } = response as any;

            // JWT 토큰 저장 (신규 형식 우선, 기존 호환성 유지)
            apiClient.setToken(accessToken || token);
            if (refreshToken) {
              apiClient.setRefreshToken(refreshToken);
            }

            // API 사용자 타입을 앱 사용자 타입으로 변환
            const user: User = {
              id: apiUser.id,
              email: apiUser.email,
              name: apiUser.name,
              role: "admin",
              avatar: undefined,
              lastLogin: new Date().toISOString(),
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
            set((state) => {
              state.isLoading = false;
              state.error =
                error.error?.message || error.message || "Registration failed";
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
          const token = apiClient.getToken();
          if (!token || !apiClient.isTokenValid()) {
            // 토큰이 없거나 유효하지 않으면 로그아웃 처리
            set((state) => {
              state.user = null;
              state.isAuthenticated = false;
            });
            return;
          }

          try {
            const response = await api.get<ApiUser>("/auth/me");

            // API는 직접 사용자 객체를 반환함
            if (response && (response as any).id) {
              const apiUser = response as any;
              const user: User = {
                id: apiUser.id,
                email: apiUser.email,
                name: apiUser.name,
                role: "admin",
                avatar: undefined,
                lastLogin: new Date().toISOString(),
              };

              localStorage.setItem("user", JSON.stringify(user));

              set((state) => {
                state.user = user;
                state.isAuthenticated = true;
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
            });
          }
        },

        refreshAuth: async () => {
          const refreshToken = apiClient.getRefreshToken();
          if (!refreshToken) return;

          try {
            const response = await api.post<LoginResponse>("/auth/refresh", {
              refreshToken,
              deviceId: localStorage.getItem('device_id'),
            });

            // API 응답이 성공인지 확인
            const responseData = response.success ? response.data : response;
            const { user: apiUser, accessToken, refreshToken: newRefreshToken, token } = responseData as any;

            // 새 토큰 저장
            apiClient.setToken(accessToken || token);
            if (newRefreshToken) {
              apiClient.setRefreshToken(newRefreshToken);
            }

            const user: User = {
              id: apiUser.id,
              email: apiUser.email,
              name: apiUser.name,
              role: "admin",
              avatar: undefined,
              lastLogin: new Date().toISOString(),
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
