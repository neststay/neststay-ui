"use client";

import { useState, type MouseEvent } from "react";

import { Icon } from "@/components/Icon";

type FavoriteButtonProps = {
  slug: string;
  initialFavourited?: boolean;
  onFavouriteChange?: (isFavourited: boolean) => void;
};

export function FavoriteButton({
  slug,
  initialFavourited = false,
  onFavouriteChange,
}: FavoriteButtonProps) {
  const [isFavourited, setIsFavourited] = useState(initialFavourited);
  const [isPending, setIsPending] = useState(false);

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isPending) {
      return;
    }

    const previous = isFavourited;
    const optimistic = !previous;

    setIsFavourited(optimistic);
    setIsPending(true);

    try {
      const response = await fetch(`/api/properties/${slug}/favourite`, {
        method: "POST",
      });

      if (response.status === 401) {
        setIsFavourited(previous);
        return;
      }

      if (!response.ok) {
        setIsFavourited(previous);
        return;
      }

      const data = (await response.json()) as { isFavourite: boolean };
      setIsFavourited(data.isFavourite);
      onFavouriteChange?.(data.isFavourite);
    } catch {
      setIsFavourited(previous);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      aria-label={isFavourited ? "Remove from favourites" : "Add to favourites"}
      aria-pressed={isFavourited}
      disabled={isPending}
      onClick={handleClick}
      className="absolute top-4 right-4 p-2 text-white transition-transform hover:scale-110 disabled:opacity-70"
    >
      <Icon
        name="favorite"
        filled={isFavourited}
        className={`h-6 w-6 ${isFavourited ? "text-primary" : ""}`}
      />
    </button>
  );
}
