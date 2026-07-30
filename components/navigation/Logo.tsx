import Image from "next/image";
import Link from "next/link";

import { BRAND_LOGO_URL, BRAND_NAME } from "@/lib/constants/config";

type LogoProps = {
  variant?: "full" | "text";
  className?: string;
};

export function Logo({ variant = "full", className = "" }: LogoProps) {
  if (variant === "text") {
    return (
      <Link
        href="/"
        className={`font-headline-md text-headline-md font-bold text-primary ${className}`.trim()}
      >
        {BRAND_NAME}
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`flex items-center gap-2 ${className}`.trim()}
    >
      <Image
        src={BRAND_LOGO_URL}
        alt={`${BRAND_NAME} logo`}
        width={40}
        height={40}
        className="h-8 w-auto md:h-10"
        priority
      />
      <span className="font-headline-md text-headline-md font-bold text-primary">
        {BRAND_NAME}
      </span>
    </Link>
  );
}
