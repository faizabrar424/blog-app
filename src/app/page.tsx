import PostDeleteButton from "@/components/PostDeleteButton";
import { IPost } from "@/server/model/Post";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const cookieStore = await cookies();
  const _id = cookieStore.get("_id");
  const resp = await fetch("http://localhost:3000/api/posts");
  const posts: IPost[] = await resp.json();

  return (
    <main className="max-w-300 mx-auto py-12 px-5 text-center">
      <section>
        <h1 className="text-5xl font-bold text-[#333] mb-4">Welcome to Post Page</h1>
        <p className="text-xl text-[#666] mb-12 max-w-150 mx-auto">Professional web developer and designer creating beautiful, responsive websites and applications.</p>
        <article className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 mt-16">
          {posts.map((post) => (
            <div key={post._id.toString()} className="bg-white p-8 rounded-lg shadow-md transition-shadow duration-300 ease-in-out hover:shadow-xl">
              <h2 className="text-brand-blue text-2xl font-bold mb-4">{/*Title: */} {post.title}</h2>
              <p className="text-[#666] leading-relaxed">{/*Content: */}  {post.content}</p>
              <p>
                Tag:{" "}
                {post.tags.map((tag, index) => (
                  <label key={`${tag}-${index}`}>{tag}, </label>
                ))}
              </p>
              <p>Created by {post.user?.name}</p>
              <Link href={`/post/${post._id.toString()}`}>Detail</Link>
              {_id?.value === post.userId?.toString() && (
                <>
                  {" "}
                  | <Link href={`/post/${post._id.toString()}/edit`}>Edit</Link> |{" "}
                  <PostDeleteButton postId={post._id.toString()} />
                </>
              )}
              {/* <hr /> */}
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
