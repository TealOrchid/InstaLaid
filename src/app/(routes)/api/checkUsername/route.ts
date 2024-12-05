import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { getSessionEmailOrThrow } from "@/actions";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  if (!username || typeof username !== "string" || username.trim() === "") {
    return NextResponse.json({ error: "Invalid username parameter" }, { status: 400 });
  }
  try {
    const currentUserEmail = await getSessionEmailOrThrow();
    const existingUser = await prisma.profile.findFirst({
      where: {
        username,
        email: { not: currentUserEmail },
      },
    });
    return NextResponse.json(!!existingUser);
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
