import Image from "next/image";

export default function Avatar({
  src,
}: {
  src: string;
}) {
  return (
    <div className="size-16 aspect-square overflow-hidden rounded-full">
      <Image
        src={src}
        alt=""
        width={600}
        height={600}
        style={{
          aspectRatio: "initial",
        }}
        unoptimized
      />
    </div>
  );
}
