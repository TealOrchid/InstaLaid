import PostsGrid from "@/components/PostsGrid";
import {prisma} from "@/db";
import {auth} from "@/auth";
import { redirect } from "next/navigation";

export default async function BrowsePage() {
  const session = await auth();
  if (!session) {
    return redirect('/login');
  }
  const profile = await prisma.profile.findUnique({
    where: {email: session?.user?.email as string},
  });
  if (profile?.username === undefined) {
    return redirect('/settings');
  }
  const posts = await prisma.post.findMany({
    orderBy: {createdAt: 'desc'},
    take: 100,
  });
  return (
    <div>
      <PostsGrid posts={posts}/>
    </div>
  );
}