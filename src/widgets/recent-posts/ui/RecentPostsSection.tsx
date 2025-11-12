import { recentArticlesMocks } from "@/shared/mocks";
import { categories } from "@/entities/category/model/data";
import { PostCard } from "@/entities/post/ui/PostCard";
import { PromoBanner } from "@/shared/ui/PromoBanner";

const categoriesMap = Object.fromEntries(
  categories.map((category) => [category.id, category]),
);

export const RecentPostsSection = () => {
  // Создаем массив элементов: первые 3 статьи, затем 2 статьи, затем баннер
  const items = [
    ...recentArticlesMocks.slice(0, 3).map((post) => ({ type: "post" as const, post })),
    ...recentArticlesMocks.slice(3, 5).map((post) => ({ type: "post" as const, post })),
    { type: "banner" as const, id: "banner-1" },
  ];

  return (
    <div className="relative w-full bg-white py-12">
      <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-[60px] px-4 max-[400px]:max-w-[340px] max-[400px]:px-[10px]">
        <h2 className="font-playfair text-2xl font-normal leading-[100%] text-[#333333] text-center sm:text-[32px]">
          Recent articles
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
      </div>
    </div>
  );
};


