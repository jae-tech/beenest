import { api } from './api-client';

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export const authApi = {
  /**
   * 비밀번호 변경
   */
  changePassword: async (data: ChangePasswordData): Promise<ChangePasswordResponse> => {
    const response = await api.patch<ChangePasswordResponse>('/auth/change-password', data);

    if (!response.success) {
      throw new Error(response.error?.message || '비밀번호 변경에 실패했습니다');
    }

    return response.data;
  },

  /**
   * 현재 사용자 정보 조회
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');

    if (!response.success) {
      throw new Error(response.error?.message || '사용자 정보를 가져올 수 없습니다');
    }

    return response.data;
  },
};