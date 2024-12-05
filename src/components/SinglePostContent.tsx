import BookmarkButton from "@/components/BookmarkButton";
import Comment from "@/components/Comment";
import LikesInfo from "@/components/LikesInfo";
import DislikesInfo from "@/components/DislikesInfo";
import VtffsInfo from "@/components/VtffInfo";
import Preloader from "@/components/Preloader";
import SessionCommentForm from "@/components/SessionCommentForm";
import { Post, Profile, Comment as CommentModel, Like, Dislike, Vtff, Bookmark, PostForApproval } from "@prisma/client";
import { Suspense } from "react";
import Avatar from "@/components/Avatar";
import { IconTrash } from "@tabler/icons-react";
import { getSessionEmail, deletePost, deleteApprovedPost, getSessionRole } from "@/actions";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default async function SinglePostContent({
  post,
  authorProfile,
  comments,
  commentsAuthors,
  myLike,
  myDislike,
  myVtff,
  myBookmark,
}: {
  post: Post | PostForApproval;
  authorProfile: Profile;
  comments: CommentModel[];
  commentsAuthors: Profile[];
  myLike: Like | null;
  myDislike: Dislike | null;
  myVtff: Vtff | null;
  myBookmark: Bookmark | null;
}) {
  const currentUserEmail = await getSessionEmail();
  const isOwner = currentUserEmail === authorProfile.email;
  const pendingPost = 'moderator' in post;
  const role = await getSessionRole();
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Image
            className="rounded-md"
            src={post.image}
            alt={post.description}
            width={800}
            height={600}
            style={{
              aspectRatio: 'initial',
            }}
            unoptimized
          />
        </div>
        <div>
          <div className="flex gap-2">
            <div>
              <Avatar src={authorProfile?.avatar || ""} />
            </div>
            <div className="w-full">
              <div className="flex justify-between gap-2">
                <Link href={`/users/${authorProfile.username}`}>
                  <h3 className="flex gap-1 dark:text-gray-300">
                    {authorProfile?.name}
                  </h3>
                  <h4 className="text-gray-600 dark:text-gray-500 text-sm -mt-1">
                    @{authorProfile?.username}
                  </h4>
                </Link>
                {(isOwner || role === 'mod') && (
                    <form
                      action={async () => {
                        "use server";
                        try {
                          await deletePost(post.id);
                        } catch {
                          await deleteApprovedPost(post.id);
                        }   
                      }}
                    >
                      <button type="submit" className="flex items-center">
                        <IconTrash />
                      </button>
                    </form>
                )}
              </div>
              <div>
                <div className="bg-gray-200 dark:bg-gray-700 border dark:border-0 dark:text-gray-400 border-gray-300 rounded-md p-4 mt-2">
                  <p>{post?.description}</p>
                </div>
                <div className="text-xs text-gray-400 text-right">
                  {format(post.createdAt, "yyyy-MM-dd HH:mm:ss")}
                </div>
              </div>
            </div>
          </div>
          {role === 'user' && (
            <div className="flex text-gray-700 dark:text-gray-400 items-center gap-2 justify-between py-4 mt-4 border-t border-b border-gray-300 dark:border-gray-700">
            <LikesInfo post={post} sessionLike={myLike} />
            <DislikesInfo post={post} sessionDislike={myDislike} />
            <VtffsInfo post={post} sessionVtff={myVtff} />
            {!pendingPost && (
              <div className="flex items-center">
                <BookmarkButton post={post} sessionBookmark={myBookmark} />
              </div>
            )}
          </div>
          )}
          <div className="pt-4 flex flex-col gap-4">
          {comments.map((comment: CommentModel) => (
            <div key={comment.id}>
              <Comment
                createdAt={comment.createdAt}
                text={comment.text}
                authorProfile={commentsAuthors.find(
                  (a) => a.email === comment.author
                )}
                commentId={comment.id}
              />
            </div>
          ))}
        </div>
          {role === 'user' && (
            <div className="pt-8">
              <Suspense fallback={<Preloader />}>
                <SessionCommentForm postId={post.id} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
