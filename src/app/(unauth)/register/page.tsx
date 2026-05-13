"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

interface IRegisterInput {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [input, setInput] = useState<IRegisterInput>({
    name: "",
    email: "",
    password: "",
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

    const resp = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
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
      <pre>{JSON.stringify(input, null, 2)}</pre>
      <h1>RegisterPage</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Name</label>
        <input name="name" type="text" value={input.name} onChange={handleChange} />
        <br />
        <label htmlFor="">Email</label>
        <input name="email" type="email" value={input.email} onChange={handleChange} />
        <br />
        <label htmlFor="">Password</label>
        <input name="password" type="password" value={input.password} onChange={handleChange} />
        <br />
        <input value={"Register"} type="submit" />
      </form>
    </div>
  );
}
