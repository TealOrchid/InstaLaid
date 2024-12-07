import Preloader from "@/components/Preloader";
import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/db";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
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

  const { query } = await searchParams;

  return (
    <div className="w-full">
      <div className="max-w-md mx-auto">
        <SearchForm />
        {typeof query !== 'undefined' && (
          <Suspense fallback={<Preloader />}>
            <SearchResults query={query} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
