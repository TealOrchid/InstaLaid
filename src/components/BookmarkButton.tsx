'use client';

import { bookmarkPost, unbookmarkPost } from "@/actions";
import { Like, Post, PostForApproval } from "@prisma/client";
import { IconBookmark } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BookmarkButton({
  post,
  sessionBookmark,
}: {
  post: Post | PostForApproval;
  sessionBookmark: Like | null;
}) {
  const router = useRouter();
  const [bookmarkedByMe, setBookmarkedByMe] = useState(!!sessionBookmark);

  return (
    <form
      action={async () => {
        setBookmarkedByMe((prev) => !prev);
        if (bookmarkedByMe) {
          await unbookmarkPost(post.id);
        } else {
          await bookmarkPost(post.id);
        }
        router.refresh();
      }}
      className="flex items-center gap-2"
    >
      <input type="hidden" name="postId" value={post.id} />
      <button type="submit" className="">
        <IconBookmark
          className={bookmarkedByMe ? "fill-magenta" : "text-black"}
        />
      </button>
    </form>
  );
}
