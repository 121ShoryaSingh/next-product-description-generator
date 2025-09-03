export function Wrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`max-w-7xl flex justify-between px-4 sm:px-6 lg:px-8 mx-auto ${className}`}
    >
      {children}
    </section>
  );
}
