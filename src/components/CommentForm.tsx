'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

interface IProps {
  postId: string;
}

export default function CommentForm(props: IProps) {
  const [comment, setComment] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resp = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ comment, postId: props.postId }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      Swal.fire({ title: data.message });
    } else {
      Swal.fire({ title: data.message });
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        name="comment"
        value={comment}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
        placeholder="Tulis komentar..."
        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-[#333] outline-none focus:border-brand-blue transition-colors"
      />
      <button
        type="submit"
        className="bg-brand-blue text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#1a4a7a] transition-colors duration-200"
      >
        Kirim
      </button>
    </form>
  );
}
