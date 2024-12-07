import PostsGrid from "@/components/PostsGrid";
import { prisma } from "@/db";
import { Avatar } from "@radix-ui/themes";
import Link from "next/link";

export default async function SearchResults({ query }: { query: string }) {
  const profiles = await prisma.profile.findMany({
    where: {
      OR: [
        { username: { contains: query } },
        { name: { contains: query } },
      ],
    },
    take: 10,
  });

  const posts = await prisma.post.findMany({
    where: {
      description: { contains: query },
    },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-lg mt-4">
        Search results for &quot;{query}&quot;
      </h1>
      {profiles?.length > 0 && (
        <div className="grid mt-4 sm:grid-cols-1 gap-2">
          {profiles.map((profile) => (
            <Link
              href={`/users/${profile.username}`}
              className="flex gap-2 bg-beige border border-beige p-2 rounded-full text-left"
              key={profile.id}
            >
              <div>
                <Avatar
                  size="4"
                  radius="full"
                  fallback="user avatar"
                  src={profile.avatar || ""}
                />
              </div>
              <div>
                <h3 className="text-neonblue">{profile.name}</h3>
                <h4 className="text-cyan text-sm">@{profile.username}</h4>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="mt-4">
        <PostsGrid posts={posts} />
      </div>
    </div>
  );
}
