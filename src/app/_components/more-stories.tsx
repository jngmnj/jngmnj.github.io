import { Post } from '@/interfaces/post';
import { PostList } from './post-list';

type Props = {
  posts: Post[];
};

export function MoreStories({ posts }: Props) {
  return (
    <section>
      <h2 className="mb-8 text-5xl leading-tight font-bold tracking-tighter md:text-7xl">
        More Stories
      </h2>
      <PostList posts={posts} />
    </section>
  );
}
