import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { signUploadParams } from "@/lib/cloudinary";

/**
 * Returns a Cloudinary signature so the client can upload directly
 * (signed upload). Requires authentication.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      { error: "Cloudinary belum dikonfigurasi" },
      { status: 503 }
    );
  }

  const { folder = "okkitchen" } = (await req.json().catch(() => ({}))) as {
    folder?: string;
  };

  const data = signUploadParams({ folder });
  return NextResponse.json(data);
}
