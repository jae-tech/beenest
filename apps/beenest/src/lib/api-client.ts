import type { ApiResponse } from "@/types/api";
import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { errorToast } from "./toast";

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    // 개발 환경에서는 Vite 프록시 사용, 프로덕션에서는 직접 API URL 사용
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("API Client initialized with baseURL:", baseURL);

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 요청 인터셉터: JWT 토큰 자동 포함 및 로깅
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터: 에러 처리 및 토큰 만료 처리
    this.instance.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        return response;
      },
      async (error: AxiosError<ApiResponse>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // 401 Unauthorized - 토큰 만료 또는 인증 실패
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const refreshToken = this.getRefreshToken();

          // Refresh token이 있으면 갱신 시도
          if (refreshToken) {
            try {
              const response = await this.instance.post('/auth/refresh', {
                refreshToken,
                deviceId: this.getDeviceId(),
              });

              const { accessToken, refreshToken: newRefreshToken } = response.data;

              // 새 토큰 저장
              this.setToken(accessToken);
              this.setRefreshToken(newRefreshToken);

              // 원래 요청 재시도
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }

              return this.instance(originalRequest);
            } catch (refreshError) {
              // Refresh 실패 시 로그아웃 처리
              console.log('Token refresh failed:', refreshError);
              this.handleAuthFailure();
            }
          } else {
            // Refresh token이 없으면 로그아웃 처리
            this.handleAuthFailure();
          }
        }

        // 네트워크 에러 처리
        if (!error.response) {
          const networkError = {
            error: {
              code: "NETWORK_ERROR",
              message: "네트워크 연결을 확인해주세요.",
            },
          };
          return Promise.reject(networkError);
        }

        // 서버 에러 응답을 그대로 전달
        return Promise.reject(error.response.data || error);
      }
    );
  }

  // GET 요청
  async get<T>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    const response = await this.instance.get(url, { params });
    return response.data;
  }

  // POST 요청
  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.instance.post(url, data);
    return response.data;
  }

  // PUT 요청
  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.instance.put(url, data);
    return response.data;
  }

  // PATCH 요청
  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.instance.patch(url, data);
    return response.data;
  }

  // DELETE 요청
  async delete<T>(url: string): Promise<T> {
    const response = await this.instance.delete(url);
    return response.data;
  }

  // 파일 업로드
  async upload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });

    return response.data;
  }

  // 토큰 설정
  setToken(token: string) {
    localStorage.setItem("auth_token", token);
  }

  // Refresh 토큰 설정
  setRefreshToken(refreshToken: string) {
    localStorage.setItem("refresh_token", refreshToken);
  }

  // 토큰 제거
  removeToken() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  // 토큰 확인
  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  // Refresh 토큰 확인
  getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
  }

  // 토큰 유효성 검사
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // JWT 토큰 디코딩 (간단한 만료 시간 확인)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  // 디바이스 ID 생성/조회
  private getDeviceId(): string {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = `web-${navigator.userAgent.slice(-10)}-${Date.now()}`;
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  // 인증 실패 처리
  private handleAuthFailure() {
    this.removeToken();

    // 로그인 페이지로 리다이렉트 (현재 위치 저장)
    const currentPath = window.location.pathname;
    if (currentPath !== "/login") {
      errorToast("로그인이 필요합니다. 다시 로그인해주세요.");
      setTimeout(() => {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }, 1000);
    }
  }
}

// 싱글톤 인스턴스 생성
export const apiClient = new ApiClient();

// 편의 메서드들
export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    apiClient.get<T>(url, params),
  post: <T>(url: string, data?: unknown) => apiClient.post<T>(url, data),
  put: <T>(url: string, data?: unknown) => apiClient.put<T>(url, data),
  patch: <T>(url: string, data?: unknown) => apiClient.patch<T>(url, data),
  delete: <T>(url: string) => apiClient.delete<T>(url),
  upload: <T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ) => apiClient.upload<T>(url, file, onProgress),
};

export default apiClient;
