'use client';

import { updateProfile } from "@/actions";
import { Profile } from "@prisma/client";
import { Button, TextArea, TextField } from "@radix-ui/themes";
import { IconCloudUpload } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SettingsForm({
  profile,
  role,
}: {
  profile: Profile | null;
  role: string;
}) {
  const router = useRouter();
  const fileInRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar || null);
  const [username, setUsername] = useState(profile?.username || "");
  const [usernameValid, setUsernameValid] = useState(true);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const usernameRegex = /^[A-Za-z0-9\-_\.]+$/;

  // Handle file upload and avatar preview
  useEffect(() => {
    if (file) {
      const data = new FormData();
      data.set("file", file);
      fetch("/api/upload", {
        method: "POST",
        body: data,
      })
        .then((response) => response.json())
        .then((url) => setAvatarUrl(url))
        .catch((error) => console.error("Upload error:", error));
    }
  }, [file]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    const isValid = usernameRegex.test(newUsername);
    setUsernameValid(isValid);
    if (isValid) {
      fetch(`/api/checkUsername?username=${encodeURIComponent(newUsername)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to check username: ${response.statusText}`);
          }
          return response.json();
        })
        .then((isTaken) => setUsernameTaken(isTaken))
        .catch((error) => console.error("Error checking username:", error));
    } else {
      setUsernameTaken(false);
    }
  };
  
  return (
    <form
      action={async (data: FormData) => {
        await updateProfile(data, role);
        router.push("/profile");
        router.refresh();
      }}
    >
      {/* Avatar Section */}
      <input type="hidden" name="avatar" value={avatarUrl || ""} />
      <div className="flex gap-4 items-center">
        <div>
          <div className="bg-gray-400 size-24 rounded-full overflow-hidden aspect-square shadow-md shadow-gray-400">
            <Image
              className="object-cover w-full h-full"
              src={avatarUrl || "https://harlequin-keen-chickadee-753.mypinata.cloud/files/bafkreifznv3isngocvxcddhmtercz7qbs5vvu5adrdgvqjucl36ipfyh3m"}
              alt="User Avatar"
              width={600}
              height={600}
              style={{
                aspectRatio: 'initial',
              }}
              unoptimized
            />
          </div>
        </div>
        <div>
          <input
            type="file"
            ref={fileInRef}
            className="hidden"
            onChange={(ev) => setFile(ev.target.files?.[0] || null)}
          />
          <Button
            type="button"
            variant="surface"
            onClick={() => fileInRef.current?.click()}
            className="bg-aubergine text-white"
          >
            <IconCloudUpload />
            Change avatar
          </Button>
        </div>
      </div>

      {/* Username Section */}
      <p className="mt-2 font-bold text-xanadu">Username</p>
      <TextField.Root
        name="username"
        value={username}
        onChange={handleUsernameChange}
        placeholder="your_username"
        maxLength={24}
        className="bg-amarguinha"
        required
      />
      {!usernameValid && <p className="text-red-700">Username can only contain letters, numbers, &quot;-&quot;, &quot;_&quot;, and &quot;.&quot;</p>}
      {usernameTaken && <p className="text-red-700">Username is already taken</p>}

      {/* User Info Fields */}
      <p className="mt-2 font-bold text-xanadu">Name</p>
      <TextField.Root
        name="name"
        defaultValue={profile?.name || String(profile?.username)}
        placeholder="John Doe"
        maxLength={24}
        className="bg-amarguinha"
      />
      <p className="mt-2 font-bold text-xanadu">Subtitle</p>
      <TextField.Root
        name="subtitle"
        defaultValue={profile?.subtitle || ""}
        placeholder="Professional Shitposter"
        maxLength={32}
        className="bg-amarguinha"
      />
      <p className="mt-2 font-bold text-xanadu">Bio</p>
      <TextArea
        name="bio"
        defaultValue={profile?.bio || ""} 
        placeholder="Tell us about yourself..."
        maxLength={256}
        className="bg-amarguinha"
      />

      {/* Save Button */}
      <div className="mt-6 flex justify-center">
        <Button variant="solid" disabled={!usernameValid || usernameTaken}>Save settings</Button>
      </div>
    </form>
  );
}
