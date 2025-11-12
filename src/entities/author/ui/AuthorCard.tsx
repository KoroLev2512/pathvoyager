import Image from "next/image";
import type { Author } from "../model/types";

type AuthorCardProps = {
  author: Author;
};

export const AuthorCard = ({ author }: AuthorCardProps) => (
  <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4 transition hover:-translate-y-1 hover:shadow-md">
    <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white">
      <Image
        src={author.avatar}
        fill
        sizes="64px"
        alt={author.name}
        className="object-cover"
      />
    </div>
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-zinc-900">{author.name}</span>
      <span className="text-sm text-zinc-500">{author.role}</span>
    </div>
  </div>
);


