export function Wrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`max-w-screen-xl md:px-16 px-8 mx-auto ${className}`}>
      <div className="">{children}</div>
    </section>
  );
}
