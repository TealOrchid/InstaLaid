'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileNav({
  isOurProfile = false,
  username,
}: {
  isOurProfile: boolean;
  username: string;
}) {
  const path = usePathname();
  const bookmarkedActive = path.includes('/bookmarked');
  const pendingActive = path.includes('/pending');
  const postsActive = !bookmarkedActive && !pendingActive;

  return (
    <section className="mt-4">
      <div className="flex justify-center gap-4 font-bold">
        <Link
          className={postsActive ? 'text-black' : "text-white"}
          href={isOurProfile ? '/profile' : `/users/${username}`}
        >
          Posts
        </Link>
        {isOurProfile && (
          <Link
            className={bookmarkedActive ? 'text-black' : "text-white"}
            href={'/profile/bookmarked'}
          >
            Bookmarked
          </Link>
        )}
        {isOurProfile && (
          <Link
            className={pendingActive ? 'text-black' : "text-white"}
            href="/profile/pending"
          >
            Pending Approval
          </Link>
        )}
      </div>
    </section>
  );
}
