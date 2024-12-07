import { IconCamera, IconHome, IconLayoutGrid, IconLogout, IconSearch, IconSettings, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { getSessionRole } from "@/actions";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/db";

export default async function MobileNav() {
  const session = await auth();
  const user = !['mod', 'admin'].includes(await getSessionRole());
  const profile = await prisma.profile.findFirst({
    where: {email: session?.user?.email as string},
  });
  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0">
      <div className="flex text-gray-700 *:flex *:items-center">
        <div className="md:block
        bg-gradient-to-b 
        from-[#FF1493] 
        via-[#00FF7F] 
        to-[#FFD700]
        w-full
        relative
        z-10 
        *:size-12
        *:flex
        *:items-center
        *:justify-center
        justify-around
        text-black">
          <Link href="/">
            <IconHome/>
          </Link>
          <Link href="/search">
            <IconSearch/>
          </Link>
          {(user && profile?.username !== undefined) && (
            <Link href="/create">
              <IconCamera/>
            </Link>
          )}
          <Link href="/browse">
            <IconLayoutGrid/>
          </Link>
          <Link href="/profile">
          {user && (
              <><IconUser /></>
            )}
            {!user && (
              <><IconSettings /></>
            )}
          </Link>
          {!user && (
            <form action={async () => {
              'use server';
              await signOut();
              redirect('/login');
            }}>
            <button
              type="submit"
              className="flex items-center ">
              <IconLogout/>
            </button>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}