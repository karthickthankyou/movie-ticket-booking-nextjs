import { Loader } from 'lucide-react'
import React from 'react'

export const Loading = () => {
  return (
    <div className="flex justify-center my-12">
      <Loader className="animate-spin" />
    </div>
  )
}
