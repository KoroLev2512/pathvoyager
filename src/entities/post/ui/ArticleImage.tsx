"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

const FALLBACK_IMAGE = "/images/mock.webp";

type ArticleImageProps = {
  src?: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  imageClassName?: string;
  imgClassName?: string;
};

export const ArticleImage = ({
  src,
  alt,
  sizes,
  priority = false,
  fill = true,
  imageClassName = "",
  imgClassName = "",
}: ArticleImageProps) => {
  const initialSrc = useMemo(() => (src && src.length > 0 ? src : FALLBACK_IMAGE), [src]);
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const isUploadedImage = currentSrc.startsWith("/uploads/");

  const handleError = useCallback(() => {
    if (currentSrc !== FALLBACK_IMAGE) {
      setCurrentSrc(FALLBACK_IMAGE);
    }
  }, [currentSrc]);

  if (isUploadedImage) {
    return (
      <img
        src={currentSrc}
        alt={alt}
        className={`object-cover object-center ${imgClassName}`.trim()}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={currentSrc || FALLBACK_IMAGE}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={`object-cover object-center ${imageClassName}`.trim()}
      priority={priority}
      onError={handleError}
    />
  );
};


