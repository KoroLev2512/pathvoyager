import Image from "next/image";
import { PromoBanner } from "@/shared/ui/PromoBanner";

export const HeroSection = () => {
  return (
    <div className="relative h-[780px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero_bg.webp"
          fill
          alt="Travel background"
          className="object-cover object-center"
          priority
        />
      </div>
      <div className="absolute left-1/2 top-1/2 flex w-[985px] -translate-x-1/2 -translate-y-[150px] flex-col items-center gap-5 text-center text-[#114b5f]">
        <h1 className="font-playfair text-[40px] font-medium leading-[1.4]">
          <p className="mb-0">Discover Hidden Gems:</p>
          <p>Your Ultimate Travel Guide</p>
        </h1>
        <p className="font-playfair text-2xl font-normal leading-[100%]">
          Expert tips, itineraries, and travel stories from around the globe.
        </p>
      </div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <PromoBanner
          title="[AdSense Adaptive • Desktop (728x90) • Banner #1]"
          width={728}
          height={90}
        />
      </div>
    </div>
  );
};


