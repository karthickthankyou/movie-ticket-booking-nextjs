'use client'
import {
  FormProviderCreateShowtime,
  FormTypeCreateShowtime,
} from '@/forms/createShowtime'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { trpcClient } from '@/trpc/clients/client'
import { useToast } from '../molecules/Toaster/use-toast'
import { Button } from '../atoms/button'
import { Label } from '../atoms/label'
import { Input } from '../atoms/input'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { revalidatePath } from '@/util/actions/revalidatePath'

export interface ICreateShowtimeProps {}

export const CreateShowtime = () => (
  <FormProviderCreateShowtime>
    <CreateShowtimeContent />
  </FormProviderCreateShowtime>
)

export const CreateShowtimeContent = ({}: ICreateShowtimeProps) => {
  const {
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext<FormTypeCreateShowtime>()
  const {
    isLoading,
    data,
    error,
    mutateAsync: createShowtime,
  } = trpcClient.showtimes.create.useMutation()

  const { toast } = useToast()
  const { replace } = useRouter()

  return (
    <div>
      <form
        onSubmit={handleSubmit(async ({ movieId, screenId, showtimes }) => {
          try {
            await createShowtime({
              movieId,
              screenId,
              showtimes: showtimes.map((time) => ({ time: time.time })),
            })
            toast({ title: 'Showtimes created.' })
            reset()
            revalidatePath('/manager/cinemas')
            replace('/manager/cinemas')
          } catch (error) {
            toast({ title: `Failed.` })
            console.log('Error', error)
          }
        })}
      >
        <SelectMovie
          setValue={(v) => {
            setValue('movieId', v)
          }}
        />
        <SelectScreen
          setValue={(v) => {
            setValue('screenId', v)
          }}
        />
        <AddShows />
        <Button loading={isLoading} type="submit">
          Submit
        </Button>
      </form>
    </div>
  )
}

export const AddShows = () => {
  const { control, register } = useFormContext<FormTypeCreateShowtime>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'showtimes',
  })

  return (
    <div>
      <Label title="Shows">
        <div className="grid grid-cols-3 gap-2">
          {fields.map((item, index) => (
            <Label key={item.id}>
              <Input
                {...register(`showtimes.${index}.time`)}
                type="datetime-local"
              />
            </Label>
          ))}
        </div>
      </Label>

      <Button
        className="flex items-center justify-center w-full py-2 mt-2 text-xs border border-dashed"
        size="sm"
        variant="link"
        onClick={() =>
          append({
            time: '',
          })
        }
      >
        <Plus className="w-4 h-4" /> Add show
      </Button>
    </div>
  )
}

export const SelectMovie = ({
  setValue,
}: {
  setValue: (id: number) => void
}) => {
  const { data, isLoading } = trpcClient.movies.movies.useQuery()

  return (
    <Label title="Movie">
      <select
        onChange={(event) => setValue(Number(event.target.value))}
        className="w-full px-3 py-2 border rounded border-input"
      >
        {isLoading ? (
          <option value="">Loading...</option>
        ) : (
          <option value="">Select a movie...</option>
        )}

        {data?.map((movie) => (
          <option key={movie.id} value={movie.id}>
            {movie.title}
          </option>
        ))}
      </select>
    </Label>
  )
}

export const SelectScreen = ({
  setValue,
}: {
  setValue: (id: number) => void
}) => {
  const { data, isLoading } = trpcClient.cinemas.myScreens.useQuery()

  return (
    <Label title="Screen number">
      <select
        onChange={(event) => setValue(Number(event.target.value))}
        className="w-full px-3 py-2 border rounded border-input"
      >
        {isLoading ? (
          <option value="">Loading...</option>
        ) : (
          <option value="">Select a screen...</option>
        )}

        {data?.map((screen) => (
          <option key={screen.id} value={screen.id}>
            {screen.Cinema.name} - {screen.number}
          </option>
        ))}
      </select>
    </Label>
  )
}
