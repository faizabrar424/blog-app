import Post, { postSchema } from '@/server/model/Post';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

interface IParams {
  params: Promise<{ id: string }>;
}

// show detail post
export async function GET(req: NextRequest, { params }: IParams) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid post id' }, { status: 400 });
    }
    const _id = new ObjectId(id);

    const post = await Post.with('user', {
      //eager loading
      select: ['_id', 'name'],
    })
      .with('comments.user', {
        //eager loading nested
        exclude: ['user.password', 'user.email'],
      })
      .where('_id', _id)
      .first();
    console.log('3. Hasil Query Post:', post);

    if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

    return NextResponse.json(post, { status: 200 });
  } catch (err) {
    console.log(err, '<<<<<<<<');
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// delete post
export async function DELETE(req: NextRequest, { params }: IParams) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid post id' }, { status: 400 });
    }
    const _id = new ObjectId(id);

    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload: user } = await jose.jwtVerify<{
      _id: string;
      name: string;
    }>(token.value, secret);
    const userId = new ObjectId(user._id);

    const post = await Post.where('_id', _id).first();
    if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

    // console.log(userId, "userId");
    // console.log(post.userId, "<<<<<<< post.userId");

    if (userId.toString() !== post.userId.toString())
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    await Post.where('_id', _id).delete();

    return NextResponse.json({ message: 'Post berhasil dihapus' }, { status: 200 });
  } catch (err) {
    console.log(err, '<<<<<<<<');
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// edit post (PUT)
export async function PUT(req: NextRequest, { params }: IParams) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid post id' }, { status: 400 });
    }
    const _id = new ObjectId(id);
    const body = await req.json();

    const validation = postSchema.safeParse(body);
    if (!validation.success) {
      const error = validation.error.issues[0];
      return NextResponse.json({ message: `${String(error.path[0])} - ${error.message}` }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload: user } = await jose.jwtVerify<{
      _id: string;
      name: string;
    }>(token.value, secret);
    const userId = new ObjectId(user._id);

    const post = await Post.where('_id', _id).first();
    if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

    if (userId.toString() !== post.userId.toString())
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    await Post.where('_id', _id).update(body);

    return NextResponse.json({ message: 'Post berhasil diupdate' }, { status: 200 });
  } catch (err) {
    console.log(err, '<<<<<<<<');
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
