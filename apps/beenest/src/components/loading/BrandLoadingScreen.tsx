export function BrandLoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* 로고 애니메이션 컨테이너 */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* 외부 원형 회전 애니메이션 */}
          <div className="absolute inset-0 rounded-full border-4 border-yellow-200 dark:border-yellow-800 animate-spin border-t-yellow-400 dark:border-t-yellow-300"></div>

          {/* 중간 원형 반대 회전 애니메이션 */}
          <div className="absolute inset-4 rounded-full border-2 border-gray-100 dark:border-gray-700 animate-spin-reverse border-b-yellow-300 dark:border-b-yellow-400"></div>

          {/* 로고 중앙 컨테이너 */}
          <div className="relative w-24 h-24 bg-yellow-400 dark:bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            {/* B 로고 */}
            <div className="text-white text-4xl font-bold">B</div>
          </div>
        </div>

        {/* 브랜드명 */}
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-wide">
            Beenest
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            재고 관리 시스템
          </p>
        </div>

        {/* 로딩 점들 */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-yellow-400 dark:bg-yellow-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-yellow-400 dark:bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-yellow-400 dark:bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  )
}