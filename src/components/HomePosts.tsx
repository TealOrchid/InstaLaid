import { deleteProfile, getSessionRole, getSessionEmailOrThrow, updateRole } from "@/actions";
import { prisma } from "@/db";
import { Avatar } from "@radix-ui/themes";
import Link from "next/link";
import { IconTrash, IconUser, IconUserCog, IconUserShield } from "@tabler/icons-react";
import SwipeablePost from "@/components/SwipeablePost"; // Client component for swipe handling
import { Profile } from "@prisma/client";
import LikesInfo from "./LikesInfo";
import DislikesInfo from "./DislikesInfo";
import VtffInfo from "./VtffInfo";
import BookmarkButton from "./BookmarkButton";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function HomePosts({
  profiles,
}: {
  profiles: Profile[];
}) {
  const currentUserRole = await getSessionRole();
  if (currentUserRole === 'admin') {
    return (
      <div>
        {profiles?.length > 0 && (
          <div className="grid mt-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex flex-col justify-between items-start bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-4 rounded-lg max-w-full overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Avatar
                    size="4"
                    radius="full"
                    fallback="user avatar"
                    src={profile.avatar || ''}
                  />
                  <Link href={`/users/${profile?.username}`}>
                    <h3>{profile.name}</h3>
                    <h4 className="text-gray-500 dark:text-gray-300 text-sm">
                      @{profile.username}
                    </h4>
                  </Link>
                </div>
                <span>Current role: {profile.role}</span>
  
                {/* Buttons container */}
                <div className="flex flex-wrap gap-2 w-full justify-start">
                  {/* Change Role to User */}
                  <form
                    action={async () => {
                      "use server";
                      await updateRole(profile.email, 'user');
                      redirect('/');
                    }}
                  >
                    <button
                      type="submit"
                      className="flex items-center gap-1 bg-gray-300 text-gray-900 px-3 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                      <IconUser />
                      <span>User</span>
                    </button>
                  </form>
  
                  {/* Change Role to Mod */}
                  <form
                    action={async () => {
                      "use server";
                      await updateRole(profile.email, 'mod');
                      redirect('/');
                    }}
                  >
                    <button
                      type="submit"
                      className="flex items-center gap-1 bg-gray-300 text-gray-900 px-3 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                      <IconUserShield />
                      <span>Moderator</span>
                    </button>
                  </form>
  
                  {/* Change Role to Admin */}
                  <form
                    action={async () => {
                      "use server";
                      await updateRole(profile.email, 'admin');
                      redirect('/');
                    }}
                  >
                    <button
                      type="submit"
                      className="flex items-center gap-1 bg-gray-300 text-gray-900 px-3 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                      <IconUserCog />
                      <span>Administrator</span>
                    </button>
                  </form>
  
                  {/* Delete Profile Form */}
                  <form
                    action={async () => {
                      "use server";
                      await deleteProfile(profile.email);
                      redirect('/');
                    }}
                  >
                    <button
                      type="submit"
                      className="flex items-center gap-1 bg-gray-300 text-red-500 px-3 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <IconTrash />
                      <span>Delete</span>
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } else if (currentUserRole === 'mod') {
    const posts = await prisma.postForApproval.findMany({
      where: { moderator: await getSessionEmailOrThrow() },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    return (
      <div className="max-w-md mx-auto flex flex-col gap-12">
        {posts.map((post) => (
          <SwipeablePost key={post.id} post={post} profiles={profiles} />
        ))}
      </div>
    );
  } else {
    const posts = await prisma.post.findMany({
      where: {
        author: {in: profiles.map(p => p.email)},
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
    const likes = await prisma.like.findMany({
      where: {
        author: await getSessionEmailOrThrow(),
        postId: {in: posts.map(p => p.id)},
      },
    });
    const dislikes = await prisma.dislike.findMany({
      where: {
        author: await getSessionEmailOrThrow(),
        postId: {in: posts.map(p => p.id)},
      },
    });
    const vtffs = await prisma.vtff.findMany({
      where: {
        author: await getSessionEmailOrThrow(),
        postId: {in: posts.map(p => p.id)},
      },
    });
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        author: await getSessionEmailOrThrow(),
        postId: {in: posts.map(p => p.id)},
      },
    });
    return (
      <div className="max-w-md mx-auto flex flex-col gap-12">
        {posts.map(post => {
          const profile = profiles.find(p => p.email === post.author);
          return (
            <div key={post.id}>
              <Link href={`/posts/${post.id}`}>
                <Image
                  className="block rounded-lg shadow-md shadow-black/50"
                  src={post.image}
                  alt=""
                  width={800}
                  height={600}
                  style={{
                    aspectRatio: 'initial',
                  }}
                  unoptimized
                />
              </Link>
              <div className="flex items-center gap-2 mt-4 justify-between">
                <div className="flex gap-2 items-center">
                  <Avatar
                    radius="full"
                    src={profile?.avatar || ''}
                    size="2"
                    fallback="avatar" />
                  <Link
                    className="font-bold text-gray-700 dark:text-gray-300"
                    href={`/users/${profile?.username}`}>
                    {profile?.name}
                  </Link>
                </div>
                <div className="flex gap-2 items-center">
                  <LikesInfo
                    post={post}
                    showText={false}
                    sessionLike={likes.find(like => like.postId === post.id) || null}
                  />
                  <DislikesInfo
                    post={post}
                    showText={false}
                    sessionDislike={dislikes.find(dislike => dislike.postId === post.id) || null}
                  />
                  <VtffInfo
                    post={post}
                    showText={false}
                    sessionVtff={vtffs.find(vtff => vtff.postId === post.id) || null}
                  />
                  <BookmarkButton
                    post={post}
                    sessionBookmark={bookmarks.find(b => b.postId === post.id) || null} />
                </div>
              </div>
              <p className="mt-2 text-slate-600 dark:text-gray-400">
                {post.description}
              </p>
            </div>
          );
        })}
      </div>
    );
  }
}
