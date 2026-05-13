import Post, { postSchema } from "@/server/model/Post";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import * as jose from "jose";
import { ObjectId } from "mongodb";

// show all post
export async function GET() {
  try {
    // ambil data dari koleksi Post dan user
    const posts = await Post.with("user", {
      select: ["_id", "name"],
    }).get();

    return NextResponse.json(posts, { status: 200 });
  } catch (err) {
    console.log(err, "<<<<<<<<");

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// add post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ambil cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");
    // console.log(token, "<<<<<<<<<<<");
    // return NextResponse.json({ message: "test" }); // untuk mentest header token lewat postman
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const validation = postSchema.safeParse(body);
    if (!validation.success) {
      const error = validation.error.issues[0];
      return NextResponse.json({ message: `${String(error.path[0])} - ${error.message}` }, { status: 400 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload: user } = await jose.jwtVerify<{
      _id: string;
      name: string;
    }>(token.value, secret);

    // console.log(user, "<<<<<<<<<<<");

    const payload = {
      title: body.title,
      content: body.content,
      tags: body.tags,
      userId: new ObjectId(user._id),
    };

    await Post.insert(payload);

    return NextResponse.json({ message: "Post berhasil dibuat" }, { status: 201 });
  } catch (err) {
    console.log(err, "<<<<");
  }
  return NextResponse.json({ message: "Internal server error" }, { status: 500 });
}
