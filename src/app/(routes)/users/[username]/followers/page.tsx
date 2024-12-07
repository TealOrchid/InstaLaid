import { prisma } from "@/db";
import { Avatar } from "@radix-ui/themes";
import Link from "next/link";

export default async function FollowersPage({ params }: { params: { username: string } }) {
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

  const followers = await prisma.follower.findMany({
    where: {
      followedProfileId: profile.id,
    },
  });

  const followerProfiles = await prisma.profile.findMany({
    where: {
      id: { in: followers.map((follow) => follow.followingProfileId) },
    },
  });

  return (
    <div>
      <h1 className="text-lg mt-4">
        {profile.name} (@{profile.username}) is followed by
      </h1>
      {followerProfiles?.length > 0 ? (
        <div className="grid mt-4 sm:grid-cols-1 gap-2">
          {followerProfiles.map((followerProfile) => (
            <Link
              href={`/users/${followerProfile.username}`}
              className="flex gap-2 bg-beige border border-beige p-2 rounded-full text-left"
              key={followerProfile.id}
            >
              <div>
                <Avatar
                  size="4"
                  radius="full"
                  fallback="user avatar"
                  src={followerProfile.avatar || ""}
                />
              </div>
              <div>
                <h3 className="text-neonblue">{followerProfile.name}</h3>
                <h4 className="text-cyan text-sm">@{followerProfile.username}</h4>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-4">{profile.name} has no followers yet.</p>
      )}
    </div>
  );
}
