import { BaseComponent } from '@/util/types'
import Image from 'next/image'

export interface IUserCardProps extends BaseComponent {
  user: {
    id: string
    image: string | null
    name: string
  }
}

export const UserCard = ({ user, children }: IUserCardProps) => {
  return (
    <div className="flex gap-2">
      <Image
        src={user.image || '/user.jpeg'}
        alt=""
        width={300}
        height={300}
        className="w-16 h-16 rounded-full"
      />
      <div>
        <div className="font-medium ">{user.name}</div>
        <div className="text-xs text-gray-500 whitespace-pre-wrap">
          {user.id}
        </div>
        {children}
      </div>
    </div>
  )
}
