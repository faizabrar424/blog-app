import PostDeleteButton from '@/components/PostDeleteButton';
import { IPost } from '@/server/model/Post';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Home() {
  const cookieStore = await cookies();
  const _id = cookieStore.get('_id');
  const resp = await fetch(`${process.env.BASE_URL}/api/posts`);
  const posts: IPost[] = await resp.json();

  return (
    <main className="min-h-screen bg-[#F1EFEC] px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-brand-blue mb-4">Blog Posts</h1>
          <p className="text-lg text-[#666] max-w-xl mx-auto">
            Temukan berbagai artikel menarik, informatif, dan inspiratif dari beragam topik pilihan.
          </p>
        </div>

        {/* Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#666] text-lg">Belum ada postingan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
            {posts.map((post) => (
              <div
                key={post._id.toString()}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                {/* Accent bar */}
                <div className="h-1.5 bg-brand-blue" />

                <div className="p-6 flex flex-col flex-1">
                  {/* Tags */}
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag, index) => (
                        <span
                          key={`${tag}-${index}`}
                          className="bg-[#F1EFEC] text-brand-blue text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-[#111] mb-2 line-clamp-2">{post.title}</h2>

                  {/* Content preview */}
                  <p className="text-[#666] text-sm leading-relaxed line-clamp-3 flex-1">{post.content}</p>

                  {/* Author */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <div className="w-7 h-7 rounded-full bg-brand-blue text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {post.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-xs text-[#666]">{post.user?.name}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <Link
                      href={`/post/${post._id.toString()}`}
                      className="flex-1 text-center bg-brand-blue text-white text-sm font-semibold py-2 rounded-lg hover:bg-[#1a4a7a] transition-colors duration-200"
                    >
                      Baca Selengkapnya
                    </Link>

                    {_id?.value === post.userId?.toString() && (
                      <>
                        <Link
                          href={`/post/${post._id.toString()}/edit`}
                          className="px-3 py-2 text-sm font-semibold text-brand-blue border border-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-colors duration-200"
                        >
                          Edit
                        </Link>
                        <PostDeleteButton postId={post._id.toString()} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
