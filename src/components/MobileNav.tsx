import { IconCamera, IconHome, IconLayoutGrid, IconLogout, IconSearch, IconSettings, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { getSessionRole } from "@/actions";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/db";

export default async function MobileNav() {
  const session = await auth();
  const currentUserRole = await getSessionRole();
  const isUser = !['mod', 'admin'].includes(currentUserRole);
  const profile = await prisma.profile.findFirst({
    where: { email: session?.user?.email as string },
  });

  const handleSignOut = async () => {
    await signOut();
    redirect('/login');
  };

  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0">
      <div className="flex text-gray-700 bg-gradient-to-b from-[#FF1493] via-[#00FF7F] to-[#FFD700] w-full justify-around items-center py-2 z-10">
        <Link href="/" className="flex items-center justify-center">
          <IconHome />
        </Link>
        <Link href="/search" className="flex items-center justify-center">
          <IconSearch />
        </Link>
        {isUser && profile?.username && (
          <Link href="/create" className="flex items-center justify-center">
            <IconCamera />
          </Link>
        )}
        <Link href="/browse" className="flex items-center justify-center">
          <IconLayoutGrid />
        </Link>
        <Link href="/profile" className="flex items-center justify-center">
          {isUser ? <IconUser /> : <IconSettings />}
        </Link>
        {!isUser && (
          <form action={handleSignOut} className="flex items-center justify-center">
            <button type="submit" className="flex items-center justify-center">
              <IconLogout />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
