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
    return api.patch<ChangePasswordResponse>('/auth/change-password', data);
  },

  /**
   * 현재 사용자 정보 조회
   */
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },
};