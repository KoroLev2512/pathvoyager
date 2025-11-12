import Image from "next/image";
import type { Category } from "../model/types";

type CategoryCardProps = {
  category: Category;
};

export const CategoryCard = ({ category }: CategoryCardProps) => (
  <article className="group relative overflow-hidden rounded-3xl border border-transparent bg-zinc-100">
    <div className="relative h-40 w-full overflow-hidden">
      <Image
        src={category.image}
        fill
        sizes="(min-width: 768px) 220px, 80vw"
        className="object-cover transition duration-500 group-hover:scale-105"
        alt={category.title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
    <div className="absolute inset-x-0 bottom-0 p-6">
      <span className="inline-flex rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur">
        {category.title}
      </span>
    </div>
  </article>
);


