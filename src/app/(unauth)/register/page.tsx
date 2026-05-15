'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

interface IRegisterInput {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [input, setInput] = useState<IRegisterInput>({
    name: '',
    email: '',
    password: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resp = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="h-2 bg-brand-blue" />
        <div className="p-10">
          <h1 className="text-3xl font-bold text-brand-blue mb-2">Register</h1>
          <p className="text-[#666] mb-8">Buat akun baru</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#333]">Name</label>
              <input
                name="name"
                type="text"
                value={input.name}
                onChange={handleChange}
                placeholder="Nama lengkap"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-[#333] outline-none focus:border-brand-blue transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#333]">Email</label>
              <input
                name="email"
                type="email"
                value={input.email}
                onChange={handleChange}
                placeholder="contoh@email.com"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-[#333] outline-none focus:border-brand-blue transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#333]">Password</label>
              <input
                name="password"
                type="password"
                value={input.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-[#333] outline-none focus:border-brand-blue transition-colors"
              />
            </div>

            <button
              type="submit"
              className="bg-brand-blue text-white font-semibold py-2.5 rounded-lg hover:bg-[#1a4a7a] transition-colors duration-200 mt-2"
            >
              Register
            </button>

            <p className="text-center text-sm text-[#666]">
              Sudah punya akun?{' '}
              <a href="/login" className="text-brand-blue font-semibold hover:underline">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
