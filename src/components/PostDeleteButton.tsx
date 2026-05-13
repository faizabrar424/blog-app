"use client";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface IProps {
  postId: string;
}

export default function PostDeleteButton(props: IProps) {
  // console.log(props.postId);

  const router = useRouter();

  const handleDelete = async () => {
    const resp = await fetch(`/api/posts/${props.postId}`, {
      method: "DELETE",
    });

    const data = await resp.json();

    if (!resp.ok) {
      Swal.fire({ title: data.message });
    } else {
      Swal.fire({ title: data.message });
      router.refresh();
    }
  };

  return <button onClick={handleDelete}>Delete Post</button>;
}
