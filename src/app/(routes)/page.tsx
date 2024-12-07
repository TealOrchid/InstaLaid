import { Suspense } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/db";
import { auth } from "@/auth";
import Preloader from "@/components/Preloader";
import Home from "@/components/Home";

export default async function Main() {
  const session = await auth();
  
  if (!session) {
    return redirect('/login');
  }
  
  const profile = await prisma.profile.findFirst({
    where: { email: session?.user?.email as string },
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
