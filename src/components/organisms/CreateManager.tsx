'use client'
import { useFormCreateManager } from '@/forms/createManager'
import { Input } from '../atoms/input'
import { Label } from '../atoms/label'

import { Title2 } from '../atoms/typography'
import { cn } from '@/util/styles'
import { BaseComponent } from '@/util/types'
import { trpcClient } from '@/trpc/clients/client'
import { revalidatePath } from '@/util/actions/revalidatePath'
import { useToast } from '../molecules/Toaster/use-toast'
import { Button } from '../atoms/button'

export interface ICreateAdminProps extends BaseComponent {}

export const CreateManager = ({ className }: ICreateAdminProps) => {
  const { register, handleSubmit, reset } = useFormCreateManager()
  const { mutateAsync } = trpcClient.managers.create.useMutation()
  const { toast } = useToast()
  return (
    <div
      className={cn(
        'w-full p-4 bg-white rounded shadow-lg max-w-96',
        className,
      )}
    >
      <Title2>Create new manager</Title2>
      <form
        onSubmit={handleSubmit(async ({ id }) => {
          const manager = await mutateAsync({ id })
          if (manager) {
            revalidatePath('/admin/managers')
            reset()
            toast({ title: 'Manager created.' })
          } else {
            toast({ title: 'Action failed.' })
          }
        })}
        className="space-y-2"
      >
        <Label title="UID">
          <Input placeholder="Enter the uid" {...register('id')} />
        </Label>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}
