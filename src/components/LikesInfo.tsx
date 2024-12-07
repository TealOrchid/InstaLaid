'use client';
import {likePost, removeLikeFromPost} from "@/actions";
import {Like, Post, PostForApproval} from "@prisma/client";
import { IconThumbUp } from "@tabler/icons-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function LikesInfo({
  post,
  sessionLike,
  showText=true,
}:{
  post:Post|PostForApproval;
  sessionLike:Like|null;
  showText?:boolean;
}) {
  const router = useRouter();
  const [likedByMe, setLikedByMe] = useState(!!sessionLike);
  return (
    <form
      action={async (data:FormData) => {
        setLikedByMe(prev => !prev);
        if (likedByMe) {
          await removeLikeFromPost(data);
        } else {
          await likePost(data);
        }
        router.refresh();
      }}
      className="flex items-center gap-2">
      <input type="hidden" name="postId" value={post.id}/>
      <button
        type="submit"
        className="">
        <IconThumbUp className={likedByMe ? 'fill-blue-500' : 'text-black'} />
      </button>
      {showText && (
        <p>{'likesCount' in post ? post.likesCount : 0}</p>
      )}
    </form>
  );
}