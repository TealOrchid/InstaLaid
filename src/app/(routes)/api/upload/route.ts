import { NextResponse, NextRequest } from "next/server";
import { pinata } from "@/config";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    const uploadData = await pinata.upload.file(file, {
      groupId: '01935476-66b7-7de4-bd28-a2bc0dc632c8',
    });

    const fileUrl = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/files/${uploadData.cid}`;

    return NextResponse.json(fileUrl, { status: 200 });
  } catch (e) {
    console.log(e);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
