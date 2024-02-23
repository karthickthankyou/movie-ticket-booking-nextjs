import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex justify-center bg-gray-100 h-screen pt-24">
      <SignUp />
    </div>
  )
}
