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
  
  // Дефолтные размеры для десктопа
  const defaultWidth = isVertical ? 300 : 728;
  const defaultHeight = isVertical ? 250 : 90;
  
  // Дефолтные размеры для мобильных
  const defaultMobileWidth = isVertical ? 300 : 320;
  const defaultMobileHeight = isVertical ? 250 : 50;

  const desktopWidth = toCssSize(width ?? defaultWidth);
  const desktopHeight = toCssSize(height ?? defaultHeight);
  const mobileWidth = toCssSize(isVertical ? (width ?? 300) : 320);
  const mobileHeight = toCssSize(isVertical ? (height ?? 250) : 50);

  // Если width = "100%", используем адаптивную высоту
  const isFullWidth = width === "100%";
  
  // Получаем числовые значения для вычисления aspect ratio
  const desktopWidthNum = typeof width === "number" ? width : (isVertical ? 300 : 728);
  const desktopHeightNum = typeof height === "number" ? height : (isVertical ? 250 : 90);
  const aspectRatio = desktopWidthNum / desktopHeightNum;
  
  // Адаптивный текст для мобильных
  const mobileTitle = title
    .replace("Desktop", "Mobile")
    .replace("728x90", "320x50")
    .replace("(728x90)", "(320x50)")
    .replace("Adaptive • Desktop", "Adaptive • Mobile");

  // Стили для мобильных и десктопа
  const mobileStyle: React.CSSProperties = {
    width: isFullWidth ? "100%" : mobileWidth,
    height: isFullWidth ? mobileHeight : mobileHeight,
    minHeight: isFullWidth ? mobileHeight : mobileHeight,
  };

  // Для десктопа: используем max-width для ограничения размера, но позволяем flex уменьшать
  const desktopStyle: React.CSSProperties = {
    maxWidth: isFullWidth ? "100%" : desktopWidth,
    width: isFullWidth ? "100%" : "100%",
    height: isFullWidth ? desktopHeight : undefined,
    minHeight: isFullWidth ? desktopHeight : desktopHeight,
    aspectRatio: isFullWidth ? undefined : `${aspectRatio}`,
    flexShrink: 1,
  };

  return (
    <>
      {/* Мобильная версия */}
      <div
        className={`flex items-center justify-center border border-neutral-200 bg-[#f8f9fa] my-5 sm:hidden ${className}`}
        style={mobileStyle}
      >
        <p className="font-inter text-xs leading-normal text-[#333333] text-center px-2">
          {mobileTitle}
        </p>
      </div>
      
      {/* Десктопная версия с адаптивным уменьшением */}
      <div
        className={`hidden items-center justify-center border border-neutral-200 bg-[#f8f9fa] my-5 sm:flex w-full ${className}`}
        style={desktopStyle}
      >
        <p className="font-inter text-base leading-normal text-[#333333] text-center px-2">
          {title}
        </p>
      </div>
    </>
  );
};


