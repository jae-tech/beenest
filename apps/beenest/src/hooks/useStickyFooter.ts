import { useCallback, useEffect, useRef, useState } from "react";

export function useStickyFooter() {
  const [showStickyFooter, setShowStickyFooter] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 스티키 푸터 표시 상태 변경 콜백 (메모이제이션)
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    // 원본 푸터가 화면에서 사라지면 스티키 푸터 표시
    setShowStickyFooter(!entry.isIntersecting);
  }, []);

  useEffect(() => {
    const currentFooter = footerRef.current;
    if (!currentFooter) return;

    // 기존 observer가 있으면 정리
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 새 observer 생성
    observerRef.current = new IntersectionObserver(
      handleIntersection,
      {
        // 푸터가 완전히 화면에서 사라졌을 때 트리거
        threshold: 0,
        rootMargin: "0px",
      }
    );

    observerRef.current.observe(currentFooter);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [handleIntersection]);

  // 컴포넌트 언마운트 시 cleanup
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    footerRef,
    showStickyFooter,
  };
}