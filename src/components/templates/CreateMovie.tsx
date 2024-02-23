'use client'

import { useFormCreateMovie } from '@/forms/createMovie'
import { trpcClient } from '@/trpc/clients/client'
import { useToast } from '../molecules/Toaster/use-toast'
import { Label } from '../atoms/label'
import { Input } from '../atoms/input'
import { Genre } from '@prisma/client'
import { HtmlSelect } from '../atoms/select'

import { Button } from '../atoms/button'
import { useRouter } from 'next/navigation'
import { revalidatePath } from '@/util/actions/revalidatePath'

export interface ICreateMovieProps {}

export const CreateMovie = ({}: ICreateMovieProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormCreateMovie()

  const { isLoading, mutateAsync: createMovie } =
    trpcClient.movies.createMovie.useMutation()

  const { toast } = useToast()
  const { replace } = useRouter()

  return (
    <div>
      <form
        onSubmit={handleSubmit(
          async ({ director, duration, genre, releaseDate, title }) => {
            await createMovie({
              director,
              duration,
              genre,
              releaseDate,
              title,
            })
            reset()
            toast({ title: 'Movie created successfully.' })
            revalidatePath('admins/movies')
            replace('/admin/movies')
          },
        )}
      >
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label title="title" error={errors.title?.message}>
              <Input placeholder="Title" {...register('title')} />
            </Label>
            <Label title="director name" error={errors.director?.message}>
              <Input placeholder="Director name" {...register('director')} />
            </Label>
            <Label title="Duration" error={errors.duration?.message}>
              <Input
                placeholder="Duration"
                {...register('duration', { valueAsNumber: true })}
              />
            </Label>
            <Label title="Release date" error={errors.releaseDate?.message}>
              <Input
                placeholder="Release date"
                type="date"
                {...register('releaseDate', {
                  setValueAs: (value) => {
                    const date = new Date(value)
                    return isNaN(date.getTime()) ? '' : date.toISOString()
                  },
                })}
              />
            </Label>
            <Label title="Genre" error={errors.genre?.message}>
              <HtmlSelect placeholder="projection type" {...register(`genre`)}>
                {Object.values(Genre).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </HtmlSelect>
            </Label>
          </div>
        </div>
        <Button loading={isLoading} type="submit">
          Submit
        </Button>
      </form>
    </div>
  )
}
