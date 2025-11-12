import { popularArticlesMocks } from "@/shared/mocks";
import { categories } from "@/entities/category/model/data";
import { PostCard } from "@/entities/post/ui/PostCard";
import { PromoBanner } from "@/shared/ui/PromoBanner";

const categoriesMap = Object.fromEntries(
  categories.map((category) => [category.id, category]),
);

export const PopularPostsSection = () => {
  // Создаем массив элементов: первые 3 статьи, затем баннер, затем остальные статьи
  const items = [
    ...popularArticlesMocks.slice(0, 3).map((post) => ({ type: "post" as const, post })),
    { type: "banner" as const, id: "banner-1" },
    ...popularArticlesMocks.slice(3, 5).map((post) => ({ type: "post" as const, post })),
    ...popularArticlesMocks.slice(5, 8).map((post) => ({ type: "post" as const, post })),
  ];

  return (
    <div className="relative w-full bg-white py-12">
      <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-[60px] px-4 max-[400px]:max-w-[340px] max-[400px]:px-[10px]">
        <h2 className="font-playfair text-2xl font-normal leading-[100%] text-[#333333] text-center sm:text-[32px]">
          Popular articles
        </h2>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            if (item.type === "banner") {
              return (
                <div
                  key={item.id}
                  className="hidden h-full w-full items-start justify-center lg:flex"
                >
                  <PromoBanner
                    title="[AdSense Rectangle • Desktop 300x250 • Banner #2]"
                    variant="vertical"
                    width={300}
                    height={250}
                  />
                </div>
              );
            }

            const category = categoriesMap[item.post.categoryId];
            if (!category) return null;

            return (
              <div key={item.post.id} className="flex justify-center lg:justify-start">
                <PostCard post={item.post} category={category} />
              </div>
            );
          })}
        </div>
        <p className="font-open-sans text-base leading-[1.4] text-[#767676] text-center w-full">
          Read more
        </p>
        <div className="w-full">
          <PromoBanner
            title="[AdSense Adaptive • Desktop (728x90) • Banner #1]"
            width="100%"
            height={90}
          />
        </div>
      </div>
    </div>
  );
};


