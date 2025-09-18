import { ApiResponse } from "@/types/api";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
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
        const originalRequest = error.config;

        // 401 Unauthorized - 토큰 만료 또는 인증 실패
        if (error.response?.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");

          // 로그인 페이지로 리다이렉트 (현재 위치 저장)
          const currentPath = window.location.pathname;
          if (currentPath !== "/login") {
            errorToast("로그인이 필요합니다. 다시 로그인해주세요.");
            setTimeout(() => {
              window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }, 1000);
          }
        }

        // 네트워크 에러 처리
        if (!error.response) {
          const networkError: ApiResponse = {
            success: false,
            error: {
              code: "NETWORK_ERROR",
              message: "네트워크 연결을 확인해주세요.",
            },
          };
          return Promise.reject(networkError);
        }

        // 서버 에러 응답 표준화
        const errorResponse: ApiResponse = {
          success: false,
          error: {
            code: error.response.data?.error?.code || "UNKNOWN_ERROR",
            message:
              error.response.data?.error?.message ||
              "알 수 없는 오류가 발생했습니다.",
            details: error.response.data?.error?.details,
          },
        };

        return Promise.reject(errorResponse);
      }
    );
  }

  // GET 요청
  async get<T>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get(url, { params });
    return response.data;
  }

  // POST 요청
  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.instance.post(url, data);
    return response.data;
  }

  // PUT 요청
  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.instance.put(url, data);
    return response.data;
  }

  // PATCH 요청
  async patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.instance.patch(url, data);
    return response.data;
  }

  // DELETE 요청
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.instance.delete(url);
    return response.data;
  }

  // 파일 업로드
  async upload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
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

  // 토큰 제거
  removeToken() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }

  // 토큰 확인
  getToken(): string | null {
    return localStorage.getItem("auth_token");
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
