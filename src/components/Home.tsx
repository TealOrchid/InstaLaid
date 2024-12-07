import { getSessionRole } from "@/actions";
import { Session } from "next-auth";
import { prisma } from "@/db";
import HomeAdmin from "@/components/HomeAdmin";
import HomeMod from "@/components/HomeMod";
import HomeUser from "@/components/HomeUser";

export default async function Home({session}:{session:Session}) {
  const currentUserRole = await getSessionRole();
  if (currentUserRole === 'admin') {
    const profiles = await prisma.profile.findMany();
    return (
      <div className="flex flex-col gap-8">
        <HomeAdmin profiles={profiles} />
      </div>
    );
  } else if (currentUserRole === 'mod') {
    const profiles = await prisma.profile.findMany();
    return (
      <div className="flex flex-col gap-8">
        <HomeMod profiles={profiles} />
      </div>
    );
  } else {
    const follows = await prisma.follower.findMany({
      where: {
        followingProfileEmail: session?.user?.email || '',
      },
    });
    const profiles = await prisma.profile.findMany({
      where: {
        id: {in: follows.map(f => f.followedProfileId)},
      },
    });
    return (
      <div className="flex flex-col gap-8">
        <HomeUser profiles={profiles} />
      </div>
    );
  }
}