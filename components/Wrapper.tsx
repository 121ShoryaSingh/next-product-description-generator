export function Wrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`w-full md:px-16 px-8 ${className}`}>
      <div>{children}</div>
    </section>
  );
}
