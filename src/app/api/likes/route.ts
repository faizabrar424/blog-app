import Post from "@/server/model/Post";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import Like from "@/server/model/Like";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!body.postId) {
      return NextResponse.json({ message: "postId is required" }, { status: 400 });
    }

    const postId = ObjectId.createFromHexString(body.postId);
    const post = await Post.where("_id", postId).first();
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload: user } = await jose.jwtVerify<{
      _id: string;
      name: string;
    }>(token.value, secret);
    const userId = new ObjectId(user._id);

    await Like.insert({
      postId: postId,
      userId: userId,
    });

    return NextResponse.json({ message: "Like berhasil ditambahkan" });
  } catch (err) {
    console.log(err);

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
