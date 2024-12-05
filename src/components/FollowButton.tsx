'use client';
import {followProfile, unfollowProfile} from "@/actions";
import {Follower} from "@prisma/client";
import { IconUserMinus, IconUserPlus } from "@tabler/icons-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function FollowButton({
  profileIdToFollow,
  ourFollow=null,
}:{
  profileIdToFollow:string;
  ourFollow:Follower|null;
}) {
  const router = useRouter();
  const [isFollowed, setIsFollowed] = useState<boolean>(!!ourFollow);
  return (
    <form action={async () => {
      setIsFollowed(prev => !prev);
      if (isFollowed) {
        await unfollowProfile(profileIdToFollow);
      } else {
        await followProfile(profileIdToFollow)
      }
      router.refresh();
    }}>
      <button
        className={'flex items-center gap-2 px-4 py-2 text-white rounded-md text-lg '+(isFollowed ? 'bg-gradient-to-tr from-ig-orange to-ig-red from-50%' : "bg-gradient-to-tr from-ig-orange to-ig-red to-80%")}>
        {isFollowed ? <IconUserMinus /> : <IconUserPlus />}
        {isFollowed ? 'Unfollow':'Follow'}
      </button>
    </form>
  );
}