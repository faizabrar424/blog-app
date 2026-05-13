"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

interface IPostInput {
  title: string;
  content: string;
  tag: string;
  tags: string[];
}

export default function CreatePostPage() {
  const [input, setInput] = useState<IPostInput>({
    title: "",
    content: "",
    tag: "",
    tags: [],
  });

  const router = useRouter();

  // mendeteksi perubahan didalam form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleAdd = () => {
    setInput({
      ...input,
      tags: [...input.tags, input.tag],
      tag: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resp = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: input.title,
        content: input.content,
        tags: input.tags,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      Swal.fire({
        title: data.message,
      });
    } else {
      router.push("/");
    }
  };

  return (
    <div>
      <h1>CreatePostPage</h1>
      <pre>{JSON.stringify(input, null, 2)}</pre>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="">Title</label>
        <input name="title" value={input.title} type="text" onChange={handleChange} />
        <br />
        <label htmlFor="">Content</label>
        <textarea name="content" value={input.content} id="" onChange={handleChange}></textarea>
        <br />
        <label htmlFor="">Tag</label>
        <input name="tag" value={input.tag} type="text" onChange={handleChange} />
        <button type="button" onClick={handleAdd}>
          Add
        </button>
        <ul>
          {/* {input.tags.map((el, i) => <li key={i}>{el}</li>)} */}
          {input.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <br />
        <input type="submit" value={"Create"} />
      </form>
    </div>
  );
}
