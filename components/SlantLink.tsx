import { Link } from "@/i18n/navigation";

type Variant = "primary" | "ghost";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-night hover:shadow-glow-strong focus-visible:shadow-glow-strong",
  ghost: "border border-fg/25 bg-night/40 text-fg hover:border-accent hover:text-accent",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

/** Classes for a slanted button; wrap the label in <span className="unslant">. */
export function slantButton(variant: Variant = "primary", size: Size = "md"): string {
  return `slant inline-flex items-center justify-center font-semibold transition-[box-shadow,border-color,color] duration-200 ${variants[variant]} ${sizes[size]}`;
}

type Props = React.ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

// Logo-slant button that links somewhere on the site
export default function SlantLink({ variant = "primary", size = "md", className = "", children, ...rest }: Props) {
  return (
    <Link {...rest} className={`${slantButton(variant, size)} ${className}`}>
      <span className="unslant">{children}</span>
    </Link>
  );
}
