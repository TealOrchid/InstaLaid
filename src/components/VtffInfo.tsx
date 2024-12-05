'use client';
import {vtffPost, removeVtffFromPost} from "@/actions";
import {Vtff, Post, PostForApproval} from "@prisma/client";
import {IconHandMiddleFinger} from '@tabler/icons-react';
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function VtffInfo({
  post,
  sessionVtff,
  showText=true,
}:{
  post:Post|PostForApproval;
  sessionVtff:Vtff|null;
  showText?:boolean;
}) {
  const router = useRouter();
  const [vtffedByMe, setVtffedByMe] = useState(!!sessionVtff);
  return (
    <form
      action={async (data:FormData) => {
        setVtffedByMe(prev => !prev);
        if (vtffedByMe) {
          await removeVtffFromPost(data);
        } else {
          await vtffPost(data);
        }
        router.refresh();
      }}
      className="flex items-center gap-2">
      <input type="hidden" name="postId" value={post.id}/>
      <button
        type="submit"
        className="">
        <IconHandMiddleFinger className={vtffedByMe ? 'text-red-500 fill-red-500' : 'dark:text-white'}/>
      </button>
      {showText && (
        <p>{'vtffsCount' in post ? post.vtffsCount : 0}</p>
      )}
    </form>
  );
}