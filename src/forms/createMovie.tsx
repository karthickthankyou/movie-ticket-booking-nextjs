import { FormProvider, useForm } from 'react-hook-form'
import { ReactNode } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Genre } from '@prisma/client'

export const schemaCreateMovie = z.object({
  genre: z.nativeEnum(Genre),
  title: z.string().min(1, { message: 'Movie name is required' }),
  director: z.string().min(1, { message: 'Director name is required' }),
  duration: z.number({ invalid_type_error: 'Duration is required.' }),
  releaseDate: z.string(),
  posterUrl: z.any(),
})

export type FormTypeCreateMovie = z.infer<typeof schemaCreateMovie>

export const useFormCreateMovie = () =>
  useForm<FormTypeCreateMovie>({
    resolver: zodResolver(schemaCreateMovie),
    defaultValues: {
      director: '',
      duration: 0,
      genre: Genre.ACTION,
      posterUrl: '',
      releaseDate: '',
      title: '',
    },
  })

export const FormProviderCreateMovie = ({
  children,
}: {
  children: ReactNode
}) => {
  const methods = useFormCreateMovie()

  return <FormProvider {...methods}>{children}</FormProvider>
}
