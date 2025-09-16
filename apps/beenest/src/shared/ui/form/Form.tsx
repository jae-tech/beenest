import { FormProvider, type UseFormReturn } from 'react-hook-form'

interface FormProps {
  form: UseFormReturn<any>
  onSubmit: (data: any) => void
  children: React.ReactNode
  className?: string
}

export const Form = ({ form, onSubmit, children, className }: FormProps) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  )
}