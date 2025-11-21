import Image from "next/image";
import type { Author } from "@/entities/author/model/types";

type AuthorsListProps = {
  authors: Author[];
  featuredImage?: string;
};

export const AuthorsList = ({ authors, featuredImage }: AuthorsListProps) => {
  return (
    <div className="w-full bg-white">
      {/* Our authors section with image */}
      <div className="flex flex-wrap items-center gap-[100px] h-[380px] justify-center px-4 py-10">
        <h2 className="flex-1 min-w-[200px] font-playfair text-[32px] font-normal leading-[100%] text-[#333333]">
          Our authors
        </h2>
        {featuredImage && (
          <div className="relative h-[380px] w-[570px] shrink-0 overflow-hidden bg-[#767676]">
            <Image
              src={featuredImage}
              fill
              sizes="570px"
              className="object-cover object-center"
              alt="Our authors"
            />
          </div>
        )}
      </div>

      {/* Authors list */}
      <div className="mx-auto w-full max-w-[1160px] px-[140px]">
        <div className="flex flex-col gap-10">
          {authors.map((author) => (
            <div key={author.id} className="flex flex-col gap-10">
              <div className="flex items-center gap-10">
                <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={author.avatar}
                    fill
                    sizes="100px"
                    className="object-cover object-center"
                    alt={author.name}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-[10px] justify-center">
                  <h3 className="font-playfair text-2xl font-normal leading-[100%] text-[#333333]">
                    {author.name}
                  </h3>
                  {author.quote && (
                    <p className="font-open-sans text-base leading-[1.4] text-[#333333]">
                      {author.quote}
                    </p>
                  )}
                </div>
              </div>
              {author.bio && (
                <p className="font-open-sans text-base font-normal leading-[1.4] text-[#333333]">
                  {author.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

