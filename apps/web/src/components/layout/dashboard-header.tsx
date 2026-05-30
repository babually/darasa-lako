import { SidebarTrigger } from '@darasa-lako/ui/components/sidebar'
import { Separator } from '@darasa-lako/ui/components/separator'    
import { Breadcrumbs } from '../breadcrumbs'
import { ModeToggle } from '../mode-toggle'
import { Button } from '@darasa-lako/ui/components/button'
import Link from 'next/link'

export default function DashboardHeader() {
  return (
    <header className='bg-background/60 sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 backdrop-blur-md md:h-14'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumbs />
      </div>
      <div className='flex items-center gap-2 px-4'>
        <ModeToggle />
        <Button
          className="rounded-full"
          nativeButton={false}
          render={<Link href="/" />}
        >Home</Button>
      </div>
    </header>
  )
}