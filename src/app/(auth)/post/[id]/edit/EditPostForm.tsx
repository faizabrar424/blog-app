'use client';

import { IPost } from '@/server/model/Post';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

interface IPostInput {
  title: string;
  content: string;
  tag: string;
  tags: string[];
}

interface IProps {
  post: IPost;
  id: string;
}

export default function EditPostForm({ post, id }: IProps) {
  const router = useRouter();
  const [input, setInput] = useState<IPostInput>({
    title: post.title,
    content: post.content,
    tag: '',
    tags: post.tags,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleAdd = () => {
    if (!input.tag) return;
    setInput({
      ...input,
      tags: [...input.tags, input.tag],
      tag: '',
    });
  };

  const handleRemoveTag = (index: number) => {
    setInput({
      ...input,
      tags: input.tags.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resp = await fetch(`/api/posts/${id}`, {
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
      Swal.fire({ title: data.message });
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl mx-auto overflow-hidden">
        <div className="h-2 bg-brand-blue" />
        <div className="p-10">
          <h1 className="text-3xl font-bold text-brand-blue mb-2">Edit Post</h1>
          <p className="text-[#666] mb-8">Edit postingan kamu</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#333]">Title</label>
              <input
                name="title"
                type="text"
                value={input.title}
                onChange={handleChange}
                placeholder="Judul postingan"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-[#333] outline-none focus:border-brand-blue transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#333]">Content</label>
              <textarea
                name="content"
                value={input.content}
                onChange={handleChange}
                placeholder="Isi postingan..."
                rows={6}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-[#333] outline-none focus:border-brand-blue transition-colors resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#333]">Tag</label>
              <div className="flex gap-2">
                <input
                  name="tag"
                  type="text"
                  value={input.tag}
                  onChange={handleChange}
                  placeholder="Tambah tag..."
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-[#333] outline-none focus:border-brand-blue transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAdd}
                  className="bg-brand-blue text-white px-4 py-2.5 rounded-lg hover:bg-[#1a4a7a] transition-colors duration-200"
                >
                  Add
                </button>
              </div>
              {input.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {input.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="bg-[#F1EFEC] text-brand-blue text-sm px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="text-[#666] hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-brand-blue text-white font-semibold py-2.5 rounded-lg hover:bg-[#1a4a7a] transition-colors duration-200 mt-2"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
