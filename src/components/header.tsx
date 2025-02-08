import Image from "next/image";
import { Button } from "./ui/button";
import { Search } from "./search";
import { FileUploader } from "./file-uploader";
import { signOutUser } from "@/lib/actions/user.actions";

export function Header() {
  async function handleSignOut() {
      'use server'
      await signOutUser();
  }

  return (
    <header className="header">
      <Search />

      <div className="header-wrapper">
        <FileUploader />

        <form action={signOutUser}>
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