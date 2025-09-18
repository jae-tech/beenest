export interface FormPageHeaderProps {
  backPath: string;
  backText?: string;
  title: string;
  subtitle?: string;
}

export interface FormPageFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitText?: string;
  cancelText?: string;
  isValid?: boolean;
}

export interface FormPageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export interface FormProgressCardProps {
  isComplete: boolean;
  message?: string;
  completedFields?: number;
  totalFields?: number;
}