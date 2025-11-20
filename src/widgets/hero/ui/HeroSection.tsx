import Image from "next/image";
import { PromoBanner } from "@/shared/ui/PromoBanner";

export const HeroSection = () => {
  return (
    <div className="relative h-[500px] w-full overflow-hidden sm:h-[600px] md:h-[700px] lg:h-[780px]">
      <div className="absolute inset-0">
        <Image
          src="/images/hero_bg.webp"
          fill
          alt="Travel background"
          className="object-cover object-center"
          priority
        />
      </div>
      <div className="absolute left-1/2 top-1/2 flex w-[90%] max-w-[985px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 px-4 text-center text-[#114b5f] sm:gap-4 md:gap-5 md:-translate-y-[150px]">
        <h1 className="font-playfair text-2xl font-medium leading-[1.4] sm:text-3xl md:text-4xl lg:text-[40px]">
          <p className="mb-0">Discover Hidden Gems:</p>
          <p>Your Ultimate Travel Guide</p>
        </h1>
        <p className="font-playfair text-base font-normal leading-[100%] sm:text-lg md:text-xl lg:text-2xl">
          Expert tips, itineraries, and travel stories from around the globe.
        </p>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:bottom-4 md:bottom-5">
        <PromoBanner
          title="[AdSense Adaptive • Desktop (728x90) • Banner #1]"
          width={728}
          height={90}
        />
      </div>
    </div>
  );
};


