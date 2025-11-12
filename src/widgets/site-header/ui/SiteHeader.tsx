"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/shared/ui/Logo";
import { BurgerIcon } from "@/shared/icons";

const navigation = [
  { title: "About Us", href: "/about" },
  { title: "Travel Blog", href: "/travel" },
  { title: "Categories", href: "/categories" },
];

export const SiteHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Close menu when clicking on a link
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  return (
    <>
      <header className="relative h-[100px] w-full bg-white z-50">
        <div className="relative h-full w-full">
          {/* Logo - centered on mobile, positioned on desktop */}
          <div className="absolute left-1/2 top-[35px] -translate-x-1/2 md:left-6 md:-translate-x-0 lg:left-[calc(50%+0.461px)] lg:top-8 lg:-translate-x-1/2">
            <Link href="/" className="block" onClick={handleLinkClick}>
              <div className="w-[169px] h-[36px] max-[400px]:w-[110.371px] max-[400px]:h-[16.834px] md:w-[169px] md:h-[36px]">
                <Logo 
                  width={169} 
                  height={36} 
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="absolute right-[60px] top-1/2 -translate-y-1/2 hidden md:flex items-center gap-[30px]">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-open-sans text-base font-normal leading-[1.4] text-[#333333] text-center whitespace-nowrap transition hover:opacity-80"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Mobile Burger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="absolute right-[10px] top-1/2 -translate-y-1/2 md:hidden p-2 transition-opacity hover:opacity-80 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            type="button"
          >
            <BurgerIcon width={35} height={35} color="#333333" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - плавное появление */}
      <div
        className={`fixed inset-x-0 top-[100px] bottom-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 cursor-pointer ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Dropdown - плавное открытие сверху вниз */}
      <aside
        className={`fixed left-0 top-[100px] w-full max-h-[calc(100vh-100px)] overflow-y-auto bg-white border-t border-[#114b5f] z-50 md:hidden transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-y-0" : "-translate-y-[125%] pointer-events-none"
        }`}
        aria-label="Mobile menu"
        aria-hidden={!isMenuOpen}
      >
        <div className="flex flex-col h-full">
          <nav className="flex flex-col gap-[40px] px-5 py-10">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className="font-open-sans text-base font-normal leading-[1.4] text-[#333333] text-center whitespace-nowrap transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#114b5f] focus:ring-offset-2 rounded px-2 py-1"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};


