// Page heading with the logo-style forward slant and an accent underline.
export default function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 lg:px-8 lg:pt-20">
      <h1 className="text-4xl leading-tight font-black italic sm:text-5xl lg:text-6xl">{children}</h1>
      <span className="slant mt-4 block h-1.5 w-20 bg-accent shadow-glow" aria-hidden="true" />
    </div>
  );
}
