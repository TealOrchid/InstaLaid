import { getSessionEmailOrThrow } from "@/actions";
import { prisma } from "@/db";
import { Avatar } from "@radix-ui/themes";
import { Profile } from "@prisma/client";
import Link from "next/link";
import LikesInfo from "./LikesInfo";
import DislikesInfo from "./DislikesInfo";
import VtffInfo from "./VtffInfo";
import BookmarkButton from "./BookmarkButton";
import Image from "next/image";

export default async function HomeUser({
  profiles,
}: {
  profiles: Profile[];
}) {
    const posts = await prisma.post.findMany({
      where: {
        author: { in: profiles.map(p => p.email) },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
    const likes = await prisma.like.findMany({
      where: {
        author: await getSessionEmailOrThrow(),
        postId: { in: posts.map(p => p.id) },
      },
    });
    const dislikes = await prisma.dislike.findMany({
      where: {
        author: await getSessionEmailOrThrow(),
        postId: { in: posts.map(p => p.id) },
      },
    });
    const vtffs = await prisma.vtff.findMany({
      where: {
        author: await getSessionEmailOrThrow(),
        postId: { in: posts.map(p => p.id) },
      },
    });
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        author: await getSessionEmailOrThrow(),
        postId: { in: posts.map(p => p.id) },
      },
    });

    return (
      <div className="max-w-md mx-auto flex flex-col gap-12">
        {posts.map(post => {
          const profile = profiles.find(p => p.email === post.author);
          return (
            <div key={post.id} className="p-2 bg-beige rounded-lg">
              <Link href={`/posts/${post.id}`}>
                <Image
                  className="rounded-lg"
                  src={post.image}
                  alt="Post"
                  width={800}
                  height={600}
                  style={{
                    aspectRatio: 'initial',
                  }}
                  unoptimized
                />
              </Link>
              <div className="flex gap-2 mt-4 items-center justify-between flex-wrap">
                <div className="flex gap-2 items-center">
                  <Avatar radius="full" src={profile?.avatar || ''} size="2" fallback="avatar" />
                  <Link href={`/users/${profile?.username}`} className="font-bold text-neonblue">
                    {profile?.name}
                  </Link>
                </div>
                <div className="flex gap-2 items-center justify-around w-full md:w-auto">
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
                    sessionBookmark={bookmarks.find(b => b.postId === post.id) || null}
                  />
                </div>
              </div>
              <p className="mt-2 text-cyan text-left">{post.description}</p>
            </div>
          );
        })}
      </div>
    );
}
