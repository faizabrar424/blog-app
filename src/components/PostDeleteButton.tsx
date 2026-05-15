'use client';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface IProps {
  postId: string;
}

export default function PostDeleteButton(props: IProps) {
  // console.log(props.postId);

  const router = useRouter();

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Hapus Post?",
      text: "Post yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#123458",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    const resp = await fetch(`/api/posts/${props.postId}`, {
      method: 'DELETE',
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
    <button
      onClick={handleDelete}
      className="px-3 py-2 text-sm font-semibold text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors duration-200"
    >
      Hapus
    </button>
  );
}
