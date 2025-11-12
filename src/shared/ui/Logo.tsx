import type { CSSProperties } from "react";
import { LogoIcon } from "@/shared/icons";

type LogoProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
};

export const Logo = ({ className = "", width, height, style }: LogoProps) => {
  return (
    <div className={className} style={style}>
      <LogoIcon width={width} height={height} />
    </div>
  );
};

