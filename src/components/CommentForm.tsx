'use client';
import { postComment } from "@/actions";
import Avatar from "@/components/Avatar";
import { Button, TextArea } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useRef, useState, FormEvent, ChangeEvent } from "react";

export default function CommentForm({ avatar, postId }: { avatar: string; postId: string }) {
  const router = useRouter();
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [isTextValid, setIsTextValid] = useState(false);
  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const textValue = event.target.value.trim();
    setIsTextValid(textValue.length > 0);
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const textValue = areaRef.current?.value.trim();
    if (!textValue) {
      return;
    }
    if (areaRef.current) {
      areaRef.current.value = '';
    }
    setIsTextValid(false);
    const formData = new FormData();
    formData.append("postId", postId);
    formData.append("text", textValue);
    await postComment(formData);
    router.refresh();
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="postId" value={postId} />
      <div className="flex gap-2">
        <div>
          <Avatar src={avatar} />
        </div>
        <div className="w-full flex flex-col gap-2">
          <TextArea
            ref={areaRef}
            name="text"
            placeholder="Tell the world what you think..."
            maxLength={256}
            onChange={handleInputChange}
            className="bg-amarguinha"
          />
          <div>
            <Button
              className="bg-aubergine"
              type="submit"
              disabled={!isTextValid}
            >
              Post comment
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
