import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EditPostForm from './EditPostForm';

interface IProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage(props: IProps) {
  const { id } = await props.params;

  const cookieStore = await cookies();
  const _id = cookieStore.get('_id');

  const resp = await fetch(`${process.env.BASE_URL}/api/posts/${id}`);
  const post = await resp.json();

  if (!resp.ok) redirect('/');

  if (_id?.value !== post.userId?.toString()) redirect('/');

  return <EditPostForm post={post} id={id} />;
}
