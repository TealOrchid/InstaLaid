"use client";

import { approvePost, deletePost } from "@/actions";
import { useSwipeable } from "react-swipeable";
import Link from "next/link";
import { Avatar } from "@radix-ui/themes";
import { PostForApproval, Profile } from "@prisma/client";
import { redirect } from "next/navigation";
import Image from "next/image";

export default function SwipeablePost({
  post,
  profiles,
}: {
  post: PostForApproval;
  profiles: Profile[];
}) {
  const profile = profiles.find(p => p.email === post.author);
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => deletePost(post.id),
    onSwipedRight: () => {
      approvePost(post.id);
      redirect('/');
    },
    preventScrollOnSwipe: true,
  });

  return (
    <div {...swipeHandlers} className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
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
      <div className="flex gap-2 mt-4 items-center">
        <Avatar radius="full" src={profile?.avatar || ''} size="2" fallback="avatar" />
        <Link href={`/users/${profile?.username}`} className="font-bold text-gray-700 dark:text-gray-300">
          {profile?.name}
        </Link>
      </div>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{post.description}</p>
    </div>
  );
}
