import Image from "next/image";

import { DEFAULT_PROPERTY_IMAGE } from "@/lib/constants/config";
import type { PropertyCardData } from "@/lib/types/property-card";
import { Heading } from "@/components/Heading";
import { FavoriteButton } from "@/components/property/FavoriteButton";
import { PropertyPrice } from "@/components/property/PropertyPrice";

type PropertyCardProps = {
  property: PropertyCardData;
};

function isLocalImage(url: string): boolean {
  return url.startsWith("/");
}

export function PropertyCard({ property }: PropertyCardProps) {
  const imageSrc = property.imageUrl || DEFAULT_PROPERTY_IMAGE;

  return (
    <article className="group flex cursor-pointer flex-col gap-sm">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-container">
        <Image
          src={imageSrc}
          alt={property.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized={isLocalImage(imageSrc)}
        />
        <FavoriteButton
          slug={property.slug}
          initialFavourited={property.isFavourited}
        />
      </div>

      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <Heading
            level="h3"
            text={property.title}
            className="font-body-lg text-body-lg font-bold text-on-surface"
          />
          <p className="font-body-md text-body-md text-on-surface-variant">
            {property.subtitle}
          </p>
          <PropertyPrice
            amount={property.pricePerNight}
            currency={property.currency}
          />
        </div>
      </div>
    </article>
  );
}
