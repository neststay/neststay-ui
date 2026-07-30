type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "main" | "section" | "header" | "footer";
};

export function PageContainer({
  children,
  className = "",
  as: Tag = "div",
}: PageContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full max-w-screen-2xl px-margin-mobile md:px-margin-desktop ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
