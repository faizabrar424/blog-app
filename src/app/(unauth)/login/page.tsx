"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { setCookie } from "../action";

interface ILoginPage {
  email: string;
  password: string;
}

export default function LoginInput() {
  const [input, setInput] = useState<ILoginPage>({
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

    const resp = await fetch("/api/login", {
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
      console.log(data, "");
      await setCookie("access_token", data.token);
      await setCookie("_id", data._id)
      router.push("/");
    }
  };

  return (
    <div>
      <pre>{JSON.stringify(input, null, 2)}</pre>
      <h1>LoginPage</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Email</label>
        <input name="email" type="email" value={input.email} onChange={handleChange} />
        <br />
        <label htmlFor="">Password</label>
        <input name="password" type="password" value={input.password} onChange={handleChange} />
        <br />
        <input value={"Login"} type="submit" />
      </form>
    </div>
  );
}
