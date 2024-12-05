import {auth} from "@/auth";
import Preloader from "@/components/Preloader";
import UserHome from "@/components/UserHome";
import { prisma } from "@/db";
import { redirect } from "next/navigation";
import {Suspense} from "react";

export default async function Home() {
  const session = await auth();
  if (!session) {
    return redirect('/login');
  }
  const profile = await prisma.profile.findFirst({
    where: {email: session?.user?.email as string},
  });
  if (profile?.username === undefined) {
    return redirect('/settings');
  }
  return (
    <div className="">
        <Suspense fallback={<Preloader />}>
          <UserHome session={session} />
        </Suspense>
    </div>
  );
}
