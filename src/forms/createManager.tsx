import { FormProvider, useForm } from 'react-hook-form'
import { ReactNode } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export const schemaCreateManager = z.object({
  id: z.string().min(1, { message: 'Manager name is required' }),
})

export type FormTypeCreateManager = z.infer<typeof schemaCreateManager>

export const useFormCreateManager = () =>
  useForm<FormTypeCreateManager>({
    resolver: zodResolver(schemaCreateManager),
  })

export const FormProviderCreateManager = ({
  children,
}: {
  children: ReactNode
}) => {
  const methods = useFormCreateManager()

  return <FormProvider {...methods}>{children}</FormProvider>
}
