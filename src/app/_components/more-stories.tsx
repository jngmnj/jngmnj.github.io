import { Post } from '@/interfaces/post';
import { PostList } from './post-list';

type Props = {
  posts: Post[];
};

export function MoreStories({ posts }: Props) {
  return (
    <section>
      <PostList posts={posts} />
    </section>
  );
}
