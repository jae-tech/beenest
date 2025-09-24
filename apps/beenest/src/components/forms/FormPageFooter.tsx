import { Button } from "@/components/ui/button";
import type { FormPageFooterProps } from "@/types/forms";
import { useStickyFooter } from "@/hooks/useStickyFooter";
import { Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function FormPageFooter({
  onCancel,
  onSubmit,
  isSubmitting = false,
  submitText = "저장",
  cancelText = "취소",
  isValid = true,
}: FormPageFooterProps) {
  const { footerRef, showStickyFooter } = useStickyFooter();
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [containerPadding, setContainerPadding] = useState(24); // 6 * 4 = 24px (p-6)

  // 사이드바 너비 및 컨테이너 패딩 감지 (반응형 처리)
  useEffect(() => {
    const checkLayout = () => {
      const sidebar = document.querySelector('.bg-gray-900');
      const isMobile = window.innerWidth < 1024;

      if (sidebar && !isMobile) {
        setSidebarWidth(sidebar.getBoundingClientRect().width);
      } else {
        setSidebarWidth(0);
      }

      // 모바일에서는 더 작은 패딩 사용
      setContainerPadding(isMobile ? 16 : 24);
    };

    checkLayout();
    window.addEventListener('resize', checkLayout);

    return () => {
      window.removeEventListener('resize', checkLayout);
    };
  }, []);

  const renderButtons = (isSticky = false) => (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="px-6 py-3 text-sm font-medium"
        disabled={isSubmitting}
        aria-label={isSticky ? `${cancelText} (하단 고정 버튼)` : cancelText}
        tabIndex={isSticky ? -1 : 0} // 스티키 버튼은 탭 순서에서 제외
      >
        {cancelText}
      </Button>
      <Button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting || !isValid}
        className="px-8 py-3 font-semibold text-sm"
        aria-label={isSticky ? `${submitText} (하단 고정 버튼)` : submitText}
        tabIndex={isSticky ? -1 : 0} // 스티키 버튼은 탭 순서에서 제외
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>저장 중...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>{submitText}</span>
          </div>
        )}
      </Button>
    </>
  );

  return (
    <>
      {/* 원본 푸터 */}
      <div
        ref={footerRef}
        className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100"
      >
        {renderButtons(false)}
      </div>

      {/* 스티키 푸터 */}
      {showStickyFooter && (
        <div
          role="complementary"
          aria-label="하단 고정 작업 버튼"
          className={cn(
            "fixed bottom-0 right-0 z-50",
            "bg-white border-t border-gray-100 shadow-lg",
            "transform transition-all duration-300 ease-in-out",
            showStickyFooter ? "translate-y-0" : "translate-y-full"
          )}
          style={{
            left: `${sidebarWidth}px`,
            width: `calc(100% - ${sidebarWidth}px)`,
          }}
        >
          <div
            className="flex items-center justify-end space-x-4 py-4"
            style={{
              paddingLeft: `${containerPadding}px`,
              paddingRight: `${containerPadding}px`,
            }}
          >
            {renderButtons(true)}
          </div>
        </div>
      )}

    </>
  );
}