import type { IconProps } from "./types";

export const MoreIcon = ({
  width = 28,
  height = 28,
  color = "#767676",
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      {...props}
    >
      <path
        d="M8.69167 19.5289L7.88783 18.725L11.9782 14.5834H3.5V13.4167H11.9782L7.889 9.27502L8.69167 8.47119L14.2205 14L8.69167 19.5289ZM15.0768 18.9805V17.8139H24.5V18.9805H15.0768ZM15.0768 10.1862V9.01952H24.5V10.1862H15.0768ZM18.5768 14.5834V13.4167H24.5V14.5834H18.5768Z"
        fill={color}
      />
    </svg>
  );
};

