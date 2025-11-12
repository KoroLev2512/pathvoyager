import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
};

export const Section = ({
  title,
  subtitle,
  action,
  children,
  id,
  className,
}: SectionProps) => (
  <section id={id} className={["space-y-8", className].filter(Boolean).join(" ")}>
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900 md:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-base text-zinc-500">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="flex items-center">{action}</div> : null}
    </header>
    <div>{children}</div>
  </section>
);


