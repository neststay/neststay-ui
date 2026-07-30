export type CategoryItem = {
  id: string;
  label: string;
  icon:
    | "cottage"
    | "beach_access"
    | "landscape"
    | "pool"
    | "local_fire_department"
    | "castle"
    | "apartment"
    | "forest";
  /** Maps to upstream `placeTypeName` search filter when set. */
  placeTypeName?: string;
};

export const CATEGORY_ITEMS: CategoryItem[] = [
  { id: "cabins", label: "Cabins", icon: "cottage", placeTypeName: "Cabin" },
  {
    id: "beachfront",
    label: "Beachfront",
    icon: "beach_access",
    placeTypeName: "Beachfront",
  },
  {
    id: "countryside",
    label: "Countryside",
    icon: "landscape",
    placeTypeName: "Countryside",
  },
  {
    id: "pools",
    label: "Amazing Pools",
    icon: "pool",
    placeTypeName: "Pool",
  },
  {
    id: "trending",
    label: "Trending",
    icon: "local_fire_department",
  },
  {
    id: "castles",
    label: "Castles",
    icon: "castle",
    placeTypeName: "Castle",
  },
  {
    id: "design",
    label: "Design",
    icon: "apartment",
    placeTypeName: "Design",
  },
  {
    id: "treehouses",
    label: "Treehouses",
    icon: "forest",
    placeTypeName: "Treehouse",
  },
];
