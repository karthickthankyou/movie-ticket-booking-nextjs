import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="flex justify-center bg-gray-100 h-screen pt-24">
      <SignIn initialValues={{ emailAddress: 'email@email.com' }} />
    </div>
  )
}
