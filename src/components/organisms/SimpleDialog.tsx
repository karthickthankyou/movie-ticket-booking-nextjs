import React, { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../atoms/dialog'

interface SimpleDialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  children: React.ReactNode
}
export const SimpleDialog = ({
  open,
  setOpen,
  title,
  children,
}: SimpleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hidden">
          {/* Hidden trigger - we'll likely manage opening elsewhere */}
        </button>
      </DialogTrigger>
      <DialogContent
        className={'lg:max-w-screen-lg overflow-y-scroll max-h-screen'}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
