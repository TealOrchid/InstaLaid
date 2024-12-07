import { prisma } from "@/db";
import { Avatar } from "@radix-ui/themes";
import Link from "next/link";

export default async function FollowingPage({ params }: { params: { username: string } }) {
  const { username } = await params;

  const profile = await prisma.profile.findFirst({
    where: {
      username: username,
    },
  });

  if (!profile) {
    return (
      <div>
        <h1 className="text-lg mt-4">Profile not found.</h1>
      </div>
    );
  }

  const following = await prisma.follower.findMany({
    where: {
      followingProfileId: profile.id,
    },
  });

  const followingProfiles = await prisma.profile.findMany({
    where: {
      id: { in: following.map((follow) => follow.followedProfileId) },
    },
  });

  return (
    <div>
      <h1 className="text-lg mt-4">
        {profile.name} (@{profile.username}) is following
      </h1>
      {followingProfiles?.length > 0 ? (
        <div className="grid mt-4 sm:grid-cols-1 gap-2">
          {followingProfiles.map((followingProfile) => (
            <Link
              href={`/users/${followingProfile.username}`}
              className="flex gap-2 bg-beige border border-beige p-2 rounded-full text-left"
              key={followingProfile.id}
            >
              <div>
                <Avatar
                  size="4"
                  radius="full"
                  fallback="user avatar"
                  src={followingProfile.avatar || ""}
                />
              </div>
              <div>
                <h3 className="text-neonblue">{followingProfile.name}</h3>
                <h4 className="text-cyan text-sm">@{followingProfile.username}</h4>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-4">{profile.name} is not following anyone yet.</p>
      )}
    </div>
  );
}
