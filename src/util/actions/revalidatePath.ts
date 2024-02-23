'use server'
import { revalidatePath as nextRevalidatePath } from 'next/cache'

export const revalidatePath = (path: string) => {
  nextRevalidatePath(path)
}
