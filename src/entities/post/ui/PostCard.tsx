import Link from "next/link";
import { MoreIcon } from "@/shared/icons";
import type { Category } from "@/entities/category/model/types";
import type { Post } from "../model/types";
import { ArticleImage } from "./ArticleImage";

type PostCardProps = {
  post: Post;
  category: Category;
};

export const PostCard = ({ post, category }: PostCardProps) => {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="group flex w-[320px] flex-col gap-[10px] px-[10px] py-5 transition hover:opacity-90"
    >
      <article className="flex flex-col gap-[10px]">
        <div className="relative h-[200px] w-full overflow-hidden">
          <ArticleImage
            src={post.image}
            alt={post.title}
            sizes="320px"
            imgClassName="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
            imageClassName="object-cover object-center transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex items-center justify-start">
          <p className="font-open-sans text-sm leading-[1.4]" style={{ color: category.color }}>
            {category.title}
          </p>
        </div>
        <div className="flex flex-col gap-[10px]">
          <h3 className="font-playfair text-2xl font-normal leading-[100%] text-[#333333]">
            {post.title}
          </h3>
          <div className="flex items-end gap-[10px]">
            <p className="flex-1 font-open-sans text-sm leading-[1.4] text-[#333333]">
              {post.excerpt}
            </p>
            <div className="h-7 w-7 shrink-0">
              <MoreIcon width={28} height={28} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};


