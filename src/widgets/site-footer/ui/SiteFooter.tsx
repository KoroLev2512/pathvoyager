import Link from "next/link";
import { Logo } from "@/shared/ui/Logo";

export const SiteFooter = () => (
  <footer className="relative h-[300px] w-full bg-white">
    {/* Logo - Mobile: centered, Desktop: left aligned */}
    <div className="flex items-center justify-center pt-8">
      {/* Mobile size */}
      <div className="md:hidden">
        <Logo width={140} height={30} />
      </div>
      {/* Desktop size */}
      <div className="hidden md:block">
        <Logo width={169} height={36} />
      </div>
    </div>
    
    {/* Navigation Links - Always centered */}
    <div className="absolute left-[calc(50%+0.5px)] top-[94.84px] md:top-[96px] flex -translate-x-1/2 flex-col items-center gap-5 font-inter text-sm font-normal leading-normal text-[#333333]">
      <Link href="/about" className="transition hover:opacity-80">
        About Us
      </Link>
      <Link href="/privacy" className="transition hover:opacity-80">
        Privacy Policy
      </Link>
      <Link href="/disclaimer" className="transition hover:opacity-80">
        Disclaimer
      </Link>
    </div>
    
    {/* Copyright - Always centered */}
    <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 font-open-sans text-sm font-normal leading-[1.4] text-[#333333] text-center">
        <p>© 2025</p>
        <p>All copy rights reserved.</p>
    </div>
  </footer>
);


