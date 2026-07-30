import type { PropertyCardData } from "@/lib/types/property-card";
import { PropertyCard } from "@/components/property/PropertyCard";

type PropertyGridProps = {
  properties: PropertyCardData[];
};

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <p className="py-xl text-center font-body-md text-body-md text-on-surface-variant">
        No properties found.
      </p>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => (
        <PropertyCard key={property.slug} property={property} />
      ))}
    </section>
  );
}
