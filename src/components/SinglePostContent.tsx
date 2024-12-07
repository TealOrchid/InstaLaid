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
  const pendingPost = "moderator" in post;
  const role = await getSessionRole();

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Post Image Section */}
        <div>
          <Image
            className="rounded-md"
            src={post.image}
            alt={post.description}
            width={800}
            height={600}
            style={{ aspectRatio: "initial" }}
            unoptimized
          />
        </div>

        {/* Post Content Section */}
        <div>
          <div className="flex gap-2">
            {/* Avatar & Author Info */}
            <div>
              <Avatar src={authorProfile?.avatar || ""} />
            </div>
            <div className="w-full">
              <div className="flex justify-between gap-2">
                <Link href={`/users/${authorProfile.username}`}>
                  <h3 className="flex gap-1 text-left">{authorProfile?.name}</h3>
                  <h4 className="text-purple-900 text-sm -mt-1 text-left">
                    @{authorProfile?.username}
                  </h4>
                </Link>

                {/* Post Delete Button for Owner or Moderator */}
                {(isOwner || role === "mod") && (
                  <form
                    action={async () => {
                      "use server";
                      if (pendingPost) {
                        await deletePost(post.id);
                      } else {
                        await deleteApprovedPost(post.id);
                      }
                    }}
                  >
                    <button type="submit" className="flex items-center">
                      <IconTrash className="text-black" />
                    </button>
                  </form>
                )}
              </div>

              {/* Post Description Section */}
              <div>
                {post?.description !== "" && (
                  <div className="bg-icterine rounded-md p-4 mt-2 text-left text-neonblue">
                    <p className="break-before-page whitespace-wrap">{post?.description}</p>
                  </div>
                )}
                <div className="text-xs text-black text-right">
                  {format(post.createdAt, "yyyy-MM-dd HH:mm:ss")}
                </div>
              </div>
            </div>
          </div>

          {/* User Interaction Section (Likes, Dislikes, Vtffs, Bookmarks) */}
          {(role === "user" && !pendingPost) && (
            <div className="flex text-black items-center gap-2 justify-between py-4 mt-4 border-t border-b border-gray-300">
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

          {/* Comments Section */}
          <div className="pt-4 flex flex-col gap-4">
            {comments.map((comment: CommentModel) => (
              <div key={comment.id}>
                <Comment
                  createdAt={comment.createdAt}
                  text={comment.text}
                  authorProfile={commentsAuthors.find((a) => a.email === comment.author)}
                  commentId={comment.id}
                />
              </div>
            ))}
          </div>

          {/* Comment Form */}
          {(role === "user" && !pendingPost) && (
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
