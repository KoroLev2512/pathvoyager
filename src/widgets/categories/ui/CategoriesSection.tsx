import { categories } from "@/entities/category/model/data";
import { CategoryCard } from "@/entities/category/ui/CategoryCard";
import { PromoBanner } from "@/shared/ui/PromoBanner";
import { Section } from "@/shared/ui/Section";

export const CategoriesSection = () => (
  <Section
    id="categories"
    title="Выберите настроение путешествия"
    subtitle="Категории помогают сузить выбор и найти идеальный маршрут для следующего приключения."
  >
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="grid gap-6 sm:grid-cols-2">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
      <PromoBanner
        title="Баннер партнёра: Тревел-страховка за 5 минут"
        description="Получите защищённое путешествие и кэшбек 10% на карту при оформлении полиса онлайн. QR-код и промокод в приложении."
        cta="Оформить"
        width="100%"
      />
    </div>
  </Section>
);


