import { getSessionRole } from "@/actions";
import {auth} from "@/auth";
import PostsGrid from "@/components/PostsGrid";
import ProfileNav from "@/components/ProfileNav";
import ProfilePageInfo from "@/components/ProfilePageInfo";
import {prisma} from "@/db";
import {redirect} from "next/navigation";

export default async function pendingApprovalPage() {
  const session = await auth();
  if (!session) {
    return redirect('/login');
  }
  if ((await getSessionRole()) !== 'user') {
    return redirect('/');
  }
  const profile = await prisma.profile
    .findFirst({where:{email:session?.user?.email as string}});
  if (!profile) {
    return redirect('/settings');
  }
  const posts = await prisma.postForApproval.findMany({
    where: {author:session?.user?.email as string},
    orderBy: {createdAt: 'asc'},
  });
  return (
    <div>
      <ProfilePageInfo
        profile={profile}
        isOurProfile={true}
        ourFollow={null} />
      <ProfileNav
        username={profile.username || ''}
        isOurProfile={true} />
      <div className="mt-4">
        <PostsGrid posts={posts} />
      </div>
    </div>
  );
}