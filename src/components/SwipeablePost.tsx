"use client";

import { approvePost, deletePost } from "@/actions";
import { useSwipeable } from "react-swipeable";
import Link from "next/link";
import { Avatar } from "@radix-ui/themes";
import { PostForApproval, Profile } from "@prisma/client";
import Image from "next/image";
import { IconCheck, IconX } from "@tabler/icons-react";

export default function SwipeablePost({
  post,
  profiles,
}: {
  post: PostForApproval;
  profiles: Profile[];
}) {
  const profile = profiles.find(p => p.email === post.author);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: async () => {
      try {
        await deletePost(post.id);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    onSwipedRight: async () => {
      try {
        await approvePost(post.id);
      } catch (error) {
        console.error("Error approving post:", error);
      }
    },
    preventScrollOnSwipe: true,
  });

  return (
    <div {...swipeHandlers} className="p-2 bg-beige rounded-lg">
      <Link href={`/posts/${post.id}`}>
        <Image
          className="rounded-lg"
          src={post.image}
          alt={post.description || "Post Image"}
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
        <Link href={`/users/${profile?.username}`} className="font-bold text-neonblue">
          {profile?.name}
        </Link>
      </div>
      <p className="mt-2 text-cyan text-left">{post.description}</p>
      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-700"
          onClick={async (e) => {
            e.preventDefault();
            try {
              await deletePost(post.id);
            } catch (error) {
              console.error("Error deleting post:", error);
            }
          }}
          aria-label="Delete Post"
        >
          <IconX />
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-700"
          onClick={async (e) => {
            e.preventDefault();
            try {
              await approvePost(post.id);
            } catch (error) {
              console.error("Error approving post:", error);
            }
          }}
          aria-label="Approve Post"
        >
          <IconCheck />
        </button>
      </div>
    </div>
  );
}
