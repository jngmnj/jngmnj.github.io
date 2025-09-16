import { Post } from '@/interfaces/post';
import { PostPreview } from './post-preview';

type Props = {
  posts: Post[];
};

export function PostList({ posts }: Props) {
  return (
    <div className="grid grid-cols-1 gap-y-10 md:gap-y-12">
      {posts.map((post) => (
        <PostPreview
          key={post.slug}
          title={post.title}
          coverImage={post.coverImage}
          date={post.date}
          author={post.author}
          slug={post.slug}
          excerpt={post.excerpt}
        />
      ))}
    </div>
  );
}
