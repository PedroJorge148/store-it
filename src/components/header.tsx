import Image from 'next/image'
import { Button } from './ui/button'
import { Search } from './search'
import { FileUploader } from './file-uploader'
import { signOutUser } from '@/lib/actions/user.actions'

interface HeaderProps {
  userId: string
  accountId: string
}

export function Header({ userId, accountId }: HeaderProps) {
  async function handleSignOut() {
    'use server'
    await signOutUser()
  }

  return (
    <header className="header">
      <Search />

      <div className="header-wrapper">
        <FileUploader ownerId={userId} accountId={accountId} />

        <form action={handleSignOut}>
          <Button
            type="submit"
            className="sign-out-button"
          >
            <Image
              src="/assets/icons/logout.svg"
              alt="logout"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  )
}
