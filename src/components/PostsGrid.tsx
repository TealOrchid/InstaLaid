'use client';

import { Post, PostForApproval } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import Masonry from 'react-masonry-css';

export default function PostsGrid({ posts }: { posts: Post[] | PostForApproval[] }) {
  return (
    <div className="max-w-4xl mx-auto">
      <Masonry
        breakpointCols={{
          default: 4,
          860: 3,
          500: 2,
        }}
        className="flex -ml-4"
        columnClassName="pl-4"
      >
        {posts.map(post => (
          <Link key={post.id} href={`/posts/${post.id}`} className="block mb-4">
            {/* Providing alt text for accessibility */}
            <Image
              className="rounded-lg"
              src={post.image || '/default-image.jpg'}
              alt={post.description || 'Post image'}
              width={800}
              height={600}
              style={{
                aspectRatio: 'initial',
              }}
              unoptimized
              layout="intrinsic"
            />
          </Link>
        ))}
      </Masonry>
    </div>
  );
}
