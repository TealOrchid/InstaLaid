import { deleteProfile } from "@/actions";
import {auth, signOut} from "@/auth";
import SettingsForm from "@/components/SettingsForm";
import {prisma} from "@/db";
import { IconLogout, IconTrash } from "@tabler/icons-react";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  const sessionEmail = session?.user?.email;
  if (!session) {
    return redirect('/login');
  }
  if (!sessionEmail) {
    return 'not logged in';
  }
  const profile = await prisma.profile.findFirst({
    where: {email: sessionEmail},
  });
  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-neonblue">
        Profile settings
      </h1>
      <p className="text-magenta text-xs text-center -mt-4 mb-4">
        {sessionEmail}
      </p>
      <SettingsForm
        profile={profile}
        role={profile?.role === undefined ? 'user' : profile?.role}
      />
      <div className="flex justify-center mt-4 pt-4 border-t border-gray-300 gap-4">
        <form
          action={async () => {
            'use server';
            await signOut();
            redirect('/login');
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-1 bg-puce text-white px-3 py-2 rounded-md hover:bg-aubergine"
          >
            <IconLogout />
            <span>Logout</span>
          </button>
        </form>
        <form
          action={async () => {
            'use server';
            await deleteProfile(sessionEmail);
            await signOut();
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
          >
            <IconTrash />
            <span>Delete</span>
          </button>
        </form>
      </div>
    </div>
  );
}