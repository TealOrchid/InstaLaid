import {getSingleApprovedPostData, getSinglePostData} from "@/actions";
import SinglePostContent from "@/components/SinglePostContent";
import {auth} from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/db";

type tParams = Promise<{ id: string }>;

export default async function SinglePostPage(props: { params: tParams }) {
  const { id } = await props.params;
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
  let post, authorProfile, comments, commentsAuthors, myLike, myDislike, myVtff, myBookmark;
  try {
    ({ 
      post, authorProfile, comments, 
      commentsAuthors, myLike, myDislike, 
      myVtff, myBookmark 
    } = await getSinglePostData(id));
  } catch {
    ({ 
      post, authorProfile, comments, 
      commentsAuthors, myLike, myDislike, 
      myVtff, myBookmark 
    } = await getSingleApprovedPostData(id));
  }
  return (
    <SinglePostContent
      post={post}
      authorProfile={authorProfile}
      comments={comments}
      commentsAuthors={commentsAuthors}
      myLike={myLike}
      myDislike={myDislike}
      myVtff={myVtff}
      myBookmark={myBookmark}
    />
  );
}