import { IconTrash, IconUser, IconUserCog, IconUserShield } from "@tabler/icons-react";
import { deleteProfile, updateRole } from "@/actions";
import { redirect } from "next/navigation";
import { Avatar } from "@radix-ui/themes";
import { Profile } from "@prisma/client";
import Link from "next/link";

export default async function HomeAdmin({
    profiles,
  }: {
    profiles: Profile[];
  }) {
    return (
        <div>
          {profiles?.length > 0 && (
            <div className="grid mt-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex flex-col justify-between items-start bg-beige p-4 rounded-lg max-w-full overflow-hidden"
                >
                  <div className="flex items-center gap-4 mb-4 text-left">
                    <Avatar
                      size="4"
                      radius="full"
                      fallback="user avatar"
                      src={profile.avatar || ''}
                    />
                    <Link href={`/users/${profile?.username}`}>
                      <h3 className="text-neonblue">{profile.name}</h3>
                      <h4 className="text-cyan text-sm">
                        @{profile.username}
                      </h4>
                    </Link>
                  </div>
                  <span className="text-white">Current role: {profile.role}</span>

                  {/* Buttons container */}
                  <div className="flex flex-wrap gap-2 w-full justify-start">
                    {/* Change Role to User */}
                    <form
                      action={async () => {
                        "use server";
                        await updateRole(profile.email, 'user');
                        redirect('/');
                      }}
                    >
                      <button
                        type="submit"
                        className="flex items-center gap-1 bg-merigold text-gray-900 px-3 py-2 rounded-md hover:bg-landisilver"
                      >
                        <IconUser />
                        <span>User</span>
                      </button>
                    </form>

                    {/* Change Role to Mod */}
                    <form
                      action={async () => {
                        "use server";
                        await updateRole(profile.email, 'mod');
                        redirect('/');
                      }}
                    >
                      <button
                        type="submit"
                        className="flex items-center gap-1 bg-pickle text-gray-900 px-3 py-2 rounded-md hover:bg-nuckla"
                      >
                        <IconUserShield />
                        <span>Moderator</span>
                      </button>
                    </form>

                    {/* Change Role to Admin */}
                    <form
                      action={async () => {
                        "use server";
                        await updateRole(profile.email, 'admin');
                        redirect('/');
                      }}
                    >
                      <button
                        type="submit"
                        className="flex items-center gap-1 bg-mauve text-gray-900 px-3 py-2 rounded-md hover:bg-boire"
                      >
                        <IconUserCog />
                        <span>Administrator</span>
                      </button>
                    </form>

                    {/* Delete Profile Form */}
                    <form
                      action={async () => {
                        "use server";
                        await deleteProfile(profile.email);
                        redirect('/');
                      }}
                    >
                      <button
                        type="submit"
                        className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-700"
                      >
                        <IconTrash />
                        <span>Delete</span>
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    );
}