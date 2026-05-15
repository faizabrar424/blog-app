import CommentForm from '@/components/CommentForm';
import { IPost } from '@/server/model/Post';
import Link from 'next/link';

interface IProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage(props: IProps) {
  const { id } = await props.params; // ambil parameter
  // console.log(id, '<<<<<<<<')

  const resp = await fetch(`${process.env.BASE_URL}/api/posts/${id}`);
  const post: IPost = await resp.json();

  if (!resp.ok)
    return (
      <div>
        <p>Post not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F1EFEC] px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-[#666] mb-6">
          <Link href="/" className="hover:text-brand-blue transition-colors">
            Posts
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#333] font-medium">{post.title}</span>
        </div>

        {/* Article */}
        <article className="bg-white rounded-2xl shadow-md mb-8 overflow-hidden">
          <div className="h-2 bg-brand-blue" />
          <div className="px-10 py-12">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {post.tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="bg-brand-blue text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-[#111] leading-tight mb-6">{post.title}</h1>

            {/* Meta */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm shrink-0">
                {post.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#333]">{post.user?.name}</p>
                <p className="text-xs text-[#666]">Penulis</p>
              </div>
            </div>

            <hr className="border-gray-100 mb-6" />

            {/* Content */}
            <div className="prose max-w-none">
              <p className="text-[#333] text-lg leading-[1.9] whitespace-pre-line wrap-break-word">{post.content}</p>
            </div>
          </div>
        </article>

        {/* Comments */}
        <div className="bg-white rounded-2xl shadow-md px-10 py-10">
          <h2 className="text-xl font-bold text-[#111] mb-1">Komentar</h2>
          <p className="text-sm text-[#666] mb-6">{post.comments?.length ?? 0} komentar</p>

          <CommentForm postId={post._id.toString()} />

          <ul className="mt-8 flex flex-col gap-4">
            {post.comments?.length === 0 && (
              <p className="text-[#666] text-sm text-center">Belum ada komentar. Jadilah yang pertama!</p>
            )}
            {post.comments?.map((comment) => (
              <li
                key={comment._id.toString()}
                className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0 overflow-hidden"
              >
                <div className="w-9 h-9 rounded-full bg-[#F1EFEC] text-brand-blue flex items-center justify-center font-bold text-sm shrink-0">
                  {comment.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#333] mb-1">{comment.user?.name}</p>
                  <p className="text-[#444] text-sm leading-relaxed wrap-break-word">{comment.comment}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
