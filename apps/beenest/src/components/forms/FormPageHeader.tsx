import { Button } from "@/components/ui/button";
import { FormPageHeaderProps } from "@/types/forms";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function FormPageHeader({
  backPath,
  backText = "돌아가기",
  title,
  subtitle,
}: FormPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      {/* 뒤로가기 버튼 */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate({ to: backPath })}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{backText}</span>
        </Button>
      </div>

      {/* 제목 및 부제목 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
    </div>
  );
}