import { FormProvider, useForm } from 'react-hook-form'
import { ReactNode } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { schemaCreateScreen } from './createScreen'

export const schemaCreateAddress = z.object({
  lat: z.number(),
  lng: z.number(),
  address: z.string(),
})

export const schemaCreateCinema = z.object({
  cinemaName: z.string().min(1, { message: 'Cinema name is required' }),
  managerId: z.string(),
  address: schemaCreateAddress,
  screens: z.array(schemaCreateScreen),
})

export type FormTypeCreateCinema = z.infer<typeof schemaCreateCinema>

export const useFormCreateCinema = () =>
  useForm<FormTypeCreateCinema>({
    resolver: zodResolver(schemaCreateCinema),
    defaultValues: {
      address: { address: '', lat: 0, lng: 0 },
      cinemaName: '',
      screens: [],
    },
  })

export const FormProviderCreateCinema = ({
  children,
}: {
  children: ReactNode
}) => {
  const methods = useFormCreateCinema()

  return <FormProvider {...methods}>{children}</FormProvider>
}
