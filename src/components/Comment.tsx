import Avatar from "@/components/Avatar";
import {Profile} from "@prisma/client";
import {format} from 'date-fns';
import { IconTrash } from '@tabler/icons-react';
import { deleteComment, getSessionEmail, getSessionRole } from "@/actions";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Comment ({
  text,
  createdAt,
  authorProfile,
  commentId,
}:{
  text: string;
  createdAt: Date;
  authorProfile?: Profile;
  commentId: string;
}) {
  const currentUserEmail = await getSessionEmail();
  const isOwner = currentUserEmail === authorProfile?.email;
  const mod = (await getSessionRole()) === 'mod';
  const currentHeaders = await headers();
  const currentPath = currentHeaders.get("referer") || "/";
  return (
    (<div className="flex gap-2">
      <div>
        <Avatar src={authorProfile?.avatar || ''}/>
      </div>
      <div className="w-full">
        <div className="flex justify-between gap-2">
          <Link href={`/users/${authorProfile?.username}`}>
            <h3 className="flex gap-1 dark:text-gray-300">
              {authorProfile?.name}
            </h3>
            <h4 className="text-gray-600 dark:text-gray-500 text-sm -mt-1">
              @{authorProfile?.username}
            </h4>
          </Link>
          {(isOwner || mod) && ( // Conditionally render the delete button if the user is the owner
            (<form
              action={async () => {
                "use server";
                if (authorProfile) {
                  await deleteComment(commentId, authorProfile.email);
                }
                redirect(currentPath);
              }}
            >
              <button type="submit" className="flex items-center">
                <IconTrash />
              </button>
            </form>)
          )}
        </div>
        <div>
          <div className="bg-gray-200 dark:bg-gray-700 border dark:border-0 dark:text-gray-400 border-gray-300 rounded-md p-4 mt-2">
            <p>
              {text}
            </p>
          </div>
          <div className="text-xs text-gray-400 text-right">
            {format(createdAt, 'yyyy-MM-dd HH:mm:ss')}
          </div>
        </div>
      </div>
    </div>)
  );
}