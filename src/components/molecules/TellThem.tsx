import { Role } from '@/util/types'
import { AlertBox } from './AlertBox'
import { CopyToClipboard } from './CopyToClipboard'

export interface ITellThemProps {
  uid: string
  role: Role
}

export const TellThem = ({ uid, role }: ITellThemProps) => {
  return (
    <AlertBox>
      <div className="max-w-sm">
        <div className="my-6 font-serif text-2xl font-semibold">Huh! 🤔</div>
        <div>Hey, we hate to break it to you...</div>{' '}
        <div>
          but you&apos;re not listed as{' '}
          <span className="font-bold">{role}</span> in our system. 🤷
        </div>
        <div className="mt-6 mb-2">
          You need to contact our admins. Hand them your unique ID.
        </div>
        <CopyToClipboard text={uid} />
      </div>
    </AlertBox>
  )
}
