import { useFormContext, Controller } from 'react-hook-form'
import { Input } from '@/shared/ui/input'

interface FormFieldProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  className?: string
}

export const FormField = ({ name, label, type = 'text', placeholder, className }: FormFieldProps) => {
  const { control, formState: { errors } } = useFormContext()

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            className={`h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 text-sm ${className}`}
          />
        )}
      />
      {errors[name] && (
        <p className="text-sm text-red-600">{errors[name]?.message as string}</p>
      )}
    </div>
  )
}