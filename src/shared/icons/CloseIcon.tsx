import type { IconProps } from "./types";

export const CloseIcon = ({
  width = 35,
  height = 35,
  color = "#333333",
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 35 35"
      fill="none"
      {...props}
    >
      <path
        d="M26.25 8.75L8.75 26.25M8.75 8.75L26.25 26.25"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

