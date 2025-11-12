import Link from "next/link";
import { authors } from "@/entities/author/model/data";
import { AuthorCard } from "@/entities/author/ui/AuthorCard";
import { PromoBanner } from "@/shared/ui/PromoBanner";
import { Section } from "@/shared/ui/Section";

export const AuthorsSection = () => (
  <Section
    id="authors"
    title="Авторы PathVoyager"
    subtitle="Команда, которая делится собственным опытом, проверенными контактами и маршрутами."
    action={
      <Link
        href="#"
        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
      >
        Стать автором
      </Link>
    }
  >
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-4 sm:grid-cols-2">
        {authors.map((author) => (
          <AuthorCard key={author.id} author={author} />
        ))}
      </div>
      <PromoBanner
        label="Партнёрство"
        title="Промо программы лояльности авиакомпании"
        description="Рекламный модуль для промокодов и спецпредложений. Гибкая настройка баннеров без обновления приложения."
        cta="Узнать больше"
        width="100%"
      />
    </div>
  </Section>
);


