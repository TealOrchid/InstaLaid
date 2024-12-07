import Preloader from "@/components/Preloader";
import Home from "@/components/Home";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { prisma } from "@/db";
import {auth} from "@/auth";

export default async function Main() {
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
          <Home session={session} />
        </Suspense>
    </div>
  );
}
