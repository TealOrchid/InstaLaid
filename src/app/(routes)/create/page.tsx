'use client';
import { postEntry } from "@/actions";
import { Button, TextArea } from "@radix-ui/themes";
import { IconCloudUpload, IconSend } from "@tabler/icons-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function CreatePage() {
  const { data: session } = useSession();
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState<File|null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (!session) {
      return redirect('/login');
    }
    if (file) {
      setIsUploading(true);
      const data = new FormData();
      data.set("file", file);
      fetch("/api/upload", {
        method: "POST",
        body: data,
      }).then(response => {
        response.json().then(url => {
          setImageUrl(url);
          setIsUploading(false);
        });
      });
    }
  }, [file, session]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('Please upload an image!');
      return;
    }
    const formData = new FormData(e.target as HTMLFormElement);
    const id = await postEntry(formData);
    router.push(`/posts/${id}`);
    router.refresh();
  };
  const isFormValid = imageUrl !== '';
  return (
    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
      <input type="hidden" name="image" value={imageUrl} />
      <div className="flex flex-col gap-4">
        <div>
          <div className="min-h-64 p-2 bg-gray-400 rounded-md relative">
            {imageUrl && (
              <Image
                className="rounded-md"
                src={imageUrl}
                alt="Uploaded"
                width={800}
                height={600}
                style={{
                  aspectRatio: 'initial',
                }}
                unoptimized
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <input
                onChange={ev => setFile(ev.target.files?.[0] || null)}
                className="hidden"
                type="file"
                ref={fileInRef}
              />
              <Button
                disabled={isUploading}
                onClick={() => fileInRef?.current?.click()}
                type="button"
                variant="surface"
              >
                {!isUploading && <IconCloudUpload size={20} />}
                {isUploading ? 'Uploading...' : 'Choose image'}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <TextArea
            name="description"
            className="h-16"
            placeholder="Add photo description..."
            maxLength={256}
          />
        </div>
      </div>
      <div className="flex mt-4 justify-center">
        <Button disabled={!isFormValid} type="submit">
          <IconSend size={20} />
          Publish
        </Button>
      </div>
    </form>
  );
}
