import { Icon } from "@/components/Icon";

type SearchSubmitButtonProps = {
  disabled?: boolean;
};

export function SearchSubmitButton({ disabled = false }: SearchSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      aria-label="Search"
      className="flex scale-100 items-center justify-center rounded-full bg-primary p-4 text-on-primary shadow-md transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon name="search" className="h-6 w-6" />
    </button>
  );
}
