import CommentForm from "@/components/CommentForm";
import { IPost } from "@/server/model/Post";
import React from "react";

interface IProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage(props: IProps) {
  const { id } = await props.params; // ambil parameter
  // console.log(id, '<<<<<<<<')

  const resp = await fetch(`http://localhost:3000/api/posts/${id}`);
  const post: IPost = await resp.json();

  if (!resp.ok)
    return (
      <div>
        <p>Post not found</p>
      </div>
    );

  return (
    <div>
      <h1>PostDetailPage</h1>
      <p>Title: {post.title}</p>
      <p>Content: {post.content}</p>
      <p>
        Tag:{" "}
        {post.tags.map((tag, index) => (
          <label key={`${tag}-${index}`}>{tag}, </label>
        ))}
      </p>
      <p>Created by {post.user?.name}</p>

      <h2>Comments</h2>
      <CommentForm postId={post._id.toString()} />
      <ul>
        {post.comments?.map((comment) => (
          <li key={comment._id.toString()}>
            {comment.comment} - {comment.user?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
