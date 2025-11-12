type PromoBannerProps = {
  label?: string;
  title: string;
  description?: string;
  cta?: string;
  variant?: "horizontal" | "vertical";
  width?: number | string;
  height?: number | string;
  className?: string;
};

const toCssSize = (value?: number | string) => {
  if (typeof value === "number") {
    return `${value}px`;
  }

  return value;
};

export const PromoBanner = ({
  title,
  variant = "horizontal",
  width,
  height,
  className = "",
}: PromoBannerProps) => {
  const isVertical = variant === "vertical";
  const defaultWidth = isVertical ? 300 : 728;
  const defaultHeight = isVertical ? 250 : 90;

  const resolvedWidth = toCssSize(width ?? defaultWidth);
  const resolvedHeight = toCssSize(height ?? defaultHeight);

  return (
    <div
      className={`flex items-center justify-center border border-neutral-200 bg-[#f8f9fa] my-5 ${className}`}
      style={{ width: resolvedWidth, height: resolvedHeight }}
    >
      <p className="font-inter text-base leading-normal text-[#333333] text-center">
        {title}
      </p>
    </div>
  );
};


