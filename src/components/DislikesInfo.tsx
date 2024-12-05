'use client';
import {dislikePost, removeDislikeFromPost} from "@/actions";
import {Dislike, Post, PostForApproval} from "@prisma/client";
import { IconThumbDown } from "@tabler/icons-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function DislikesInfo({
  post,
  sessionDislike,
  showText=true,
}:{
  post:Post|PostForApproval;
  sessionDislike:Dislike|null;
  showText?:boolean;
}) {
  const router = useRouter();
  const [dislikedByMe, setDislikedByMe] = useState(!!sessionDislike);
  return (
    <form
      action={async (data:FormData) => {
        setDislikedByMe(prev => !prev);
        if (dislikedByMe) {
          // remove dislike
          await removeDislikeFromPost(data);
        } else {
          // add dislike
          await dislikePost(data);
        }
        router.refresh();
      }}
      className="flex items-center gap-2">
      <input type="hidden" name="postId" value={post.id}/>
      <button
        type="submit"
        className="">
        <IconThumbDown className={dislikedByMe ? 'text-red-500 fill-red-500' : 'dark:text-white'} />
      </button>
      {showText && (
        <p>{'dislikesCount' in post ? post.dislikesCount : 0}</p>
      )}
    </form>
  );
}