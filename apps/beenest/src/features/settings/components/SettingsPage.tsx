import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { authApi, type ChangePasswordData } from "@/lib/auth-api";
import { successToast, errorToast } from "@/lib/toast";
import {
  Camera,
  HardDrive,
  LogOut,
  User,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Link,
  Unlink,
  Settings,
  Save,
  TestTube2,
  ShoppingCart,
  Store,
  Package,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("account");
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");


  // 전자상거래 API 키 관리 상태
  const [apiKeys, setApiKeys] = useState({
    naver: {
      clientId: "",
      clientSecret: "",
      isConnected: false,
      showSecret: false,
    },
    coupang: {
      accessKey: "",
      secretKey: "",
      isConnected: false,
      showSecret: false,
    },
    elevenst: {
      apiKey: "",
      apiSecret: "",
      isConnected: false,
      showSecret: false,
    },
    gmarket: {
      apiKey: "",
      apiSecret: "",
      isConnected: false,
      showSecret: false,
    },
  });

  const [testingConnection, setTestingConnection] = useState({
    naver: false,
    coupang: false,
    elevenst: false,
    gmarket: false,
  });

  // 비밀번호 변경 함수
  const handlePasswordChange = async () => {
    // 클라이언트 측 유효성 검사
    if (!passwordData.currentPassword) {
      setPasswordError("현재 비밀번호를 입력해주세요.");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError("새 비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");

    try {
      const changePasswordData: ChangePasswordData = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      };

      const result = await authApi.changePassword(changePasswordData);

      // 성공 처리
      setPasswordSuccess(result.message);
      successToast("비밀번호가 성공적으로 변경되었습니다.");

      // 폼 초기화
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "비밀번호 변경에 실패했습니다.";
      setPasswordError(errorMessage);
      errorToast(errorMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  // API 키 관련 헬퍼 함수들
  const toggleSecretVisibility = (platform: keyof typeof apiKeys) => {
    setApiKeys(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        showSecret: !prev[platform].showSecret,
      },
    }));
  };

  const updateApiKey = (platform: keyof typeof apiKeys, field: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  };

  const testConnection = async (platform: keyof typeof apiKeys) => {
    setTestingConnection(prev => ({ ...prev, [platform]: true }));

    try {
      // TODO: 실제 API 연결 테스트 로직 구현
      await new Promise(resolve => setTimeout(resolve, 2000)); // 시뮬레이션

      setApiKeys(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          isConnected: true,
        },
      }));

      successToast(`${getPlatformName(platform)} 연결이 성공했습니다.`);
    } catch (error) {
      errorToast(`${getPlatformName(platform)} 연결에 실패했습니다.`);
    } finally {
      setTestingConnection(prev => ({ ...prev, [platform]: false }));
    }
  };

  const saveApiKeys = (platform: keyof typeof apiKeys) => {
    // TODO: API 키 저장 로직 구현
    console.log(`${platform} API 키 저장:`, apiKeys[platform]);
    successToast(`${getPlatformName(platform)} API 키가 저장되었습니다.`);
  };

  const getPlatformName = (platform: keyof typeof apiKeys) => {
    const names = {
      naver: "네이버 스마트스토어",
      coupang: "쿠팡",
      elevenst: "11번가",
      gmarket: "지마켓",
    };
    return names[platform];
  };

  const getPlatformIcon = (platform: keyof typeof apiKeys) => {
    const icons = {
      naver: Store,
      coupang: Package,
      elevenst: ShoppingCart,
      gmarket: Zap,
    };
    return icons[platform];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">설정</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">계정 및 시스템 설정을 관리하세요</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/" })}
              className="cursor-pointer whitespace-nowrap"
            >
              <LogOut className="h-4 w-4 mr-2" />
              대시보드로 돌아가기
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Card className="p-0 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6">
              <TabsList className="grid w-full grid-cols-2 bg-transparent h-16">
                <TabsTrigger
                  value="account"
                  className="flex items-center space-x-2 data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 data-[state=active]:bg-transparent rounded-none h-full"
                >
                  <User className="h-4 w-4" />
                  <span>계정 설정</span>
                </TabsTrigger>
                <TabsTrigger
                  value="system"
                  className="flex items-center space-x-2 data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 data-[state=active]:bg-transparent rounded-none h-full"
                >
                  <HardDrive className="h-4 w-4" />
                  <span>시스템 설정</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Contents */}
            <div className="p-6">
              {/* Account Settings */}
              <TabsContent value="account" className="mt-0 space-y-8">
                <div className="max-w-4xl space-y-6">
                  {/* Profile Section */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">프로필 정보</h3>
                    <div className="flex flex-col items-center mb-8">
                      <Avatar className="w-24 h-24 mb-4">
                        <AvatarImage
                          src="https://readdy.ai/api/search-image?query=professional%20business%20person%20avatar%20portrait%20clean%20white%20background%20modern%20corporate%20style%20friendly%20smile&width=150&height=150&seq=profile-avatar-001&orientation=squarish"
                          alt="프로필 이미지"
                        />
                        <AvatarFallback className="bg-yellow-100 text-yellow-600 text-2xl font-semibold">
                          사용자
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" className="cursor-pointer whitespace-nowrap">
                        <Camera className="h-4 w-4 mr-2" />
                        사진 변경
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">이름</label>
                        <Input
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          placeholder="이름을 입력하세요"
                          className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">이메일</label>
                        <Input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          placeholder="이메일을 입력하세요"
                          className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">전화번호</label>
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="전화번호를 입력하세요"
                          className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">부서</label>
                        <Input
                          value={profileData.department}
                          onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                          placeholder="부서를 입력하세요"
                          className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                        />
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          계정 상태: {isAuthenticated ? '활성' : '비활성'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end mt-8">
                      <Button
                        onClick={() => {
                          // TODO: API 호출로 프로필 업데이트 구현
                          console.log('프로필 업데이트:', profileData);
                          alert('프로필이 업데이트되었습니다. (향후 API 연동 예정)');
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 whitespace-nowrap cursor-pointer"
                      >
                        변경사항 저장
                      </Button>
                    </div>
                  </div>

                  {/* Password Change Section */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">비밀번호 변경</h3>
                    <div className="space-y-4 max-w-md">
                      {passwordError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-600">{passwordError}</p>
                        </div>
                      )}
                      {passwordSuccess && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-600">{passwordSuccess}</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">현재 비밀번호</label>
                        <Input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => {
                            setPasswordData({ ...passwordData, currentPassword: e.target.value });
                            setPasswordError("");
                            setPasswordSuccess("");
                          }}
                          disabled={passwordLoading}
                          placeholder="현재 비밀번호를 입력하세요"
                          className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">새 비밀번호</label>
                        <Input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => {
                            setPasswordData({ ...passwordData, newPassword: e.target.value });
                            setPasswordError("");
                            setPasswordSuccess("");
                          }}
                          disabled={passwordLoading}
                          placeholder="새 비밀번호를 입력하세요 (최소 8자)"
                          className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">새 비밀번호 확인</label>
                        <Input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => {
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                            setPasswordError("");
                            setPasswordSuccess("");
                          }}
                          disabled={passwordLoading}
                          placeholder="새 비밀번호를 다시 입력하세요"
                          className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                        />
                      </div>
                      <Button
                        onClick={handlePasswordChange}
                        disabled={passwordLoading}
                        className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-semibold px-6 py-2 whitespace-nowrap"
                      >
                        {passwordLoading ? "변경 중..." : "비밀번호 변경"}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* System Configuration */}
              <TabsContent value="system" className="mt-0 space-y-8">
                <div className="max-w-6xl space-y-6">
                  {/* E-commerce API Keys Management */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">전자상거래 플랫폼 API 키 관리</h3>
                    <p className="text-gray-600 mb-8">판매 채널별 API 키를 설정하여 재고 및 주문 정보를 자동으로 동기화하세요.</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {(Object.keys(apiKeys) as Array<keyof typeof apiKeys>).map((platform) => {
                        const PlatformIcon = getPlatformIcon(platform);
                        const platformData = apiKeys[platform];
                        const isTesting = testingConnection[platform];

                        return (
                          <div key={platform} className="border border-gray-200 rounded-lg p-6">
                            {/* Platform Header */}
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  <PlatformIcon className="h-6 w-6 text-gray-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{getPlatformName(platform)}</h4>
                                  <div className="flex items-center space-x-2 mt-1">
                                    {platformData.isConnected ? (
                                      <>
                                        <Link className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-green-600 font-medium">연결됨</span>
                                      </>
                                    ) : (
                                      <>
                                        <Unlink className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-500">연결 안됨</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* API Key Fields */}
                            <div className="space-y-4">
                              {platform === 'naver' && (
                                <>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">클라이언트 ID</label>
                                    <Input
                                      value={platformData.clientId}
                                      onChange={(e) => updateApiKey(platform, 'clientId', e.target.value)}
                                      placeholder="클라이언트 ID를 입력하세요"
                                      className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">클라이언트 Secret</label>
                                    <div className="relative">
                                      <Input
                                        type={platformData.showSecret ? "text" : "password"}
                                        value={platformData.clientSecret}
                                        onChange={(e) => updateApiKey(platform, 'clientSecret', e.target.value)}
                                        placeholder="클라이언트 Secret을 입력하세요"
                                        className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 pr-10"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleSecretVisibility(platform)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
                                      >
                                        {platformData.showSecret ? (
                                          <EyeOff className="h-3 w-3" />
                                        ) : (
                                          <Eye className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </>
                              )}

                              {platform === 'coupang' && (
                                <>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Access Key</label>
                                    <Input
                                      value={platformData.accessKey}
                                      onChange={(e) => updateApiKey(platform, 'accessKey', e.target.value)}
                                      placeholder="Access Key를 입력하세요"
                                      className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Secret Key</label>
                                    <div className="relative">
                                      <Input
                                        type={platformData.showSecret ? "text" : "password"}
                                        value={platformData.secretKey}
                                        onChange={(e) => updateApiKey(platform, 'secretKey', e.target.value)}
                                        placeholder="Secret Key를 입력하세요"
                                        className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 pr-10"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleSecretVisibility(platform)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
                                      >
                                        {platformData.showSecret ? (
                                          <EyeOff className="h-3 w-3" />
                                        ) : (
                                          <Eye className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </>
                              )}

                              {(platform === 'elevenst' || platform === 'gmarket') && (
                                <>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">API Key</label>
                                    <Input
                                      value={platformData.apiKey}
                                      onChange={(e) => updateApiKey(platform, 'apiKey', e.target.value)}
                                      placeholder="API Key를 입력하세요"
                                      className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">API Secret</label>
                                    <div className="relative">
                                      <Input
                                        type={platformData.showSecret ? "text" : "password"}
                                        value={platformData.apiSecret}
                                        onChange={(e) => updateApiKey(platform, 'apiSecret', e.target.value)}
                                        placeholder="API Secret을 입력하세요"
                                        className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 pr-10"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleSecretVisibility(platform)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
                                      >
                                        {platformData.showSecret ? (
                                          <EyeOff className="h-3 w-3" />
                                        ) : (
                                          <Eye className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </>
                              )}

                              {/* Action Buttons */}
                              <div className="flex space-x-2 pt-4">
                                <Button
                                  onClick={() => saveApiKeys(platform)}
                                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 cursor-pointer whitespace-nowrap"
                                  size="sm"
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  저장
                                </Button>
                                <Button
                                  onClick={() => testConnection(platform)}
                                  disabled={isTesting}
                                  variant="outline"
                                  size="sm"
                                  className="cursor-pointer whitespace-nowrap"
                                >
                                  <TestTube2 className="h-4 w-4 mr-2" />
                                  {isTesting ? "테스트 중..." : "연결 테스트"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Settings className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">API 키 관리 안내</p>
                          <p className="text-sm text-blue-700 mt-1">
                            각 플랫폼의 판매자 센터에서 API 키를 발급받아 입력하세요. 연결이 완료되면 재고 및 주문 정보가 자동으로 동기화됩니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Theme Settings */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">테마 설정</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">다크 모드</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">어두운 테마로 변경하여 눈의 피로를 줄입니다</p>
                        </div>
                        <Switch
                          checked={theme === "dark"}
                          onCheckedChange={toggleTheme}
                        />
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          ✅ 다크 모드가 활성화되었습니다. 토글하여 즉시 테마를 변경할 수 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}