import { Card } from "@/components/ui/card";
import { FormProgressCardProps } from "@/types/forms";
import { CheckCircle, Info } from "lucide-react";

export function FormProgressCard({
  isComplete,
  message = "양식 작성 진행 상태",
  completedFields,
  totalFields,
}: FormProgressCardProps) {
  const getStatusText = () => {
    if (completedFields !== undefined && totalFields !== undefined) {
      return `필수 항목: ${completedFields}/${totalFields} 완료`;
    }
    return `필수 항목: ${isComplete ? "완료" : "미완료"}`;
  };

  const getStatusIcon = () => {
    return isComplete ? (
      <CheckCircle className="h-4 w-4 text-white" />
    ) : (
      <Info className="h-4 w-4 text-white" />
    );
  };

  const getStatusColor = () => {
    return isComplete ? "bg-green-400" : "bg-yellow-400";
  };

  const getCardColor = () => {
    return isComplete ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200";
  };

  return (
    <Card className={`p-6 ${getCardColor()}`}>
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 ${getStatusColor()} rounded-full flex items-center justify-center`}>
          {getStatusIcon()}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">{message}</h3>
          <p className="text-sm text-gray-600">{getStatusText()}</p>
        </div>
      </div>
    </Card>
  );
}