'use client';
import { Button } from '@darasa-lako/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@darasa-lako/ui/components/dropdown-menu';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { headers } from "next/headers";
import { auth } from "@darasa-lako/auth";

export async function UserNav() {
    const router = useRouter();
    const session = await auth.api.getSession({
        headers: await headers(),
    });

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <UserAvatarProfile
              user={{
                name: session.user.name,
                email: session.user.email,
                image: session.user.image ?? undefined
              }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' sideOffset={10}>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm leading-none font-medium'>{session?.user.name}</p>
              <p className='text-muted-foreground text-xs leading-none'>
                {session?.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push('/dashboard/profile' as any)}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>New Team</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/login")}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}