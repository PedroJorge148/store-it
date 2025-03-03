import React from 'react'
import { Header } from '@/components/header'
import { MobileNav } from '@/components/mobile-nav'
import { Sidebar } from '@/components/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser()

  if (!currentUser) return redirect('/sign-in')

  return (
    <main className="flex h-screen">
      <Sidebar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNav {...currentUser} />
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />

        <div className="main-content">
          {children}
        </div>
      </section>
      <Toaster />
    </main>
  )
}
