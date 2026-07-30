type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = {
  level: HeadingLevel;
  text: string;
  className?: string;
};

export function Heading({ level, text, className }: HeadingProps) {
  const Tag = level;

  return <Tag className={className}>{text}</Tag>;
}
