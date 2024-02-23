import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex justify-center py-24 bg-gradient-to-b from-gray-100 to-white">
      <SignIn initialValues={{ emailAddress: 'email@email.com' }} />
    </div>
  )
}
