'use client';

import { IPost } from '@/server/model/Post';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface IPostInput {
  title: string;
  content: string;
  tag: string;
  tags: string[];
}

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  // console.log(params, "<<<<<<<<<<<,")
  const router = useRouter();
  const [input, setInput] = useState<IPostInput>({
    title: '',
    content: '',
    tag: '',
    tags: [],
  });

  useEffect(() => {
    const getPostById = async () => {
      const resp = await fetch(`http://localhost:3000/api/posts/${params.id}`);
      const post: IPost = await resp.json();

      setInput((prev) => ({
        ...prev,
        title: post.title,
        content: post.content,
        tags: post.tags,
      }));
    };
    getPostById();
  }, [params.id]);

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
      tag: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resp = await fetch(`/api/posts/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
      router.push('/');
    }
  };

  return (
    <div>
      <h1>EditPostPage</h1>
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
          {input.tags.map((tag, index) => (
            <li key={`${tag}-${index}`}>{tag}</li>
          ))}
        </ul>
        <br />
        <input type="submit" value={'Edit'} />
      </form>
    </div>
  );
}
