import { getSessionRole } from "@/actions";
import FollowButton from "@/components/FollowButton";
import { Follower, Profile } from "@prisma/client";
import { IconCheck, IconSettings } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilePageInfo({
  profile,
  isOurProfile,
  ourFollow,
}: {
  profile: Profile;
  isOurProfile: boolean;
  ourFollow: Follower | null;
}) {
  const user = (await getSessionRole()) === 'user';

  return (
    <div>
      <section className="flex items-center justify-between">
        <div className="flex-1 flex justify-center">
          <div className="font-bold flex items-center gap-2">
            {profile.username}
            <div className="w-5 h-5 rounded-full bg-icterine inline-flex justify-center items-center text-black">
              <IconCheck size={16} />
            </div>
          </div>
        </div>
        {isOurProfile && (
          <Link href="/settings">
            <IconSettings />
          </Link>
        )}
      </section>

      <section className="mt-8 flex justify-center">
        <div className="w-48 h-48 p-2 rounded-full bg-icterine">
          <div className="w-44 h-44 p-2 bg-white rounded-full">
            <div className="w-40 h-40 aspect-square overflow-hidden rounded-full">
              <Image
                className=""
                src={profile.avatar || ""}
                alt="Profile Avatar"
                width={600}
                height={600}
                style={{
                  aspectRatio: 'initial',
                }}
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      <section className="text-center mt-4">
        <h1 className="text-xl font-bold">{profile.name}</h1>
        <p className="text-gray-500 mt-1 mb-1">{profile.subtitle}</p>
        <p>{profile.bio}</p>
      </section>

      <section className="flex justify-center gap-4 mt-4">
        <Link 
          href={`/users/${profile.username}/followers`}
          className="bg-sky-600 border-sky-600 border-8 rounded-full text-white hover:bg-sky-700 hover:border-sky-700"
        >
          Followers
        </Link>
        <Link 
          href={`/users/${profile.username}/following`}
          className="bg-violet-600 border-violet-600 border-8 rounded-full text-white hover:bg-violet-700 hover:border-violet-700"
        >
          Following
        </Link>
      </section>

      {!isOurProfile && user && (
        <section className="flex justify-center my-3">
          <FollowButton ourFollow={ourFollow} profileIdToFollow={profile.id} />
        </section>
      )}
    </div>
  );
}
