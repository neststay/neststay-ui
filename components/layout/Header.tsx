"use client";

import { useEffect, useState } from "react";

import { PageContainer } from "@/components/layout/PageContainer";
import { HeaderActions } from "@/components/navigation/HeaderActions";
import { Logo } from "@/components/navigation/Logo";
import { Navigation } from "@/components/navigation/Navigation";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-surface transition-shadow ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <PageContainer className="flex items-center justify-between py-4">
        <Logo variant="full" />
        <Navigation />
        <HeaderActions />
      </PageContainer>
    </header>
  );
}
