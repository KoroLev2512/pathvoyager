import Image from "next/image";

type CategoryDetailProps = {
  image: string;
  title: string;
  color: string;
  description: string;
  features: string[];
};

export const CategoryDetail = ({
  image,
  title,
  color,
  description,
  features,
  showHeader = true,
}: CategoryDetailProps & { showHeader?: boolean }) => {
  return (
    <div className="flex flex-col gap-10 max-[400px]:gap-5">
      {showHeader && (
        <div className="flex items-center gap-10 max-[400px]:gap-5">
          <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full">
            <Image
              src={image}
              fill
              sizes="100px"
              className="object-cover object-center"
              alt={title}
            />
          </div>
          <h2
            className="flex-1 font-playfair text-2xl font-normal leading-[100%] max-[400px]:text-xl"
            style={{ color }}
          >
            {title}
          </h2>
        </div>
      )}
      <div className="flex flex-col">
        <p className="font-open-sans text-base font-normal leading-[1.4] text-[#333333] max-[400px]:text-sm">
          {description}
        </p>
        <div className="flex flex-col gap-2 mt-2">
          <p className="font-open-sans text-base font-normal leading-[1.4] text-[#333333] max-[400px]:text-sm">
            What you'll find here:
          </p>
          <ul className="list-disc ml-[21px] space-y-1">
            {features.map((feature, index) => (
              <li
                key={index}
                className="font-open-sans text-base font-normal leading-[1.4] text-[#333333] max-[400px]:text-sm"
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

