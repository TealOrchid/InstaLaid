import SwipeablePost from "@/components/SwipeablePost";
import { getSessionEmailOrThrow } from "@/actions";
import { Profile } from "@prisma/client";
import { prisma } from "@/db";

export default async function HomeUser({
  profiles,
}: {
  profiles: Profile[];
}) {
  const posts = await prisma.postForApproval.findMany({
    where: { moderator: await getSessionEmailOrThrow() },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return (
    <div className="max-w-md mx-auto flex flex-col gap-12">
      {posts.map((post) => (
        <SwipeablePost key={post.id} post={post} profiles={profiles} />
      ))}
    </div>
  );
}
