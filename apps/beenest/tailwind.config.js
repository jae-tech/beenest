import rootConfig from "@/tailwind.config";

const config = {
  // 루트 설정을 확장하여 공통 테마를 상속받습니다.
  ...rootConfig,
  // 앱 내에서 사용되는 파일 경로만 별도로 정의합니다.
  content: ["./**/*.{js,ts,jsx,tsx}"],
  theme: {
    // 앱 고유의 테마 확장
    extend: {
      ...(rootConfig.theme?.extend || {}),
      // 앱에만 적용되는 추가적인 색상, 폰트 등
      appSpecificColor: "#ff5722",
    },
  },
};

export default config;
