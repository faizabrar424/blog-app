"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

interface IProps {
  postId: string;
}

export default function CommentForm(props: IProps) {
  const [comment, setComment] = useState("");
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resp = await fetch("http://localhost:3000/api/comments", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ comment, postId: props.postId }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      Swal.fire({ title: data.message });
    } else {
        Swal.fire({title: data.message})
        router.refresh()
    }
  };

  return (
    <div>
      <p>Comment: {comment}</p>
      <form onSubmit={handleSubmit}>
        <label>Comment</label>
        <input
          name="comment"
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
        />
        <input type="submit" value={"Comment"} />
      </form>
    </div>
  );
}
