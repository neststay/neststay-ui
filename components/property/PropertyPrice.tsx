type PropertyPriceProps = {
  amount: number;
  currency: string;
};

function formatNightlyPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PropertyPrice({ amount, currency }: PropertyPriceProps) {
  return (
    <p className="mt-2 font-body-lg text-body-lg text-on-surface">
      <span className="font-bold">{formatNightlyPrice(amount, currency)}</span>{" "}
      night
    </p>
  );
}
