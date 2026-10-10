import "./globals.css";

// The real <html>/<body> live in app/[locale]/layout.tsx so each language
// gets the right lang attribute. This root layout only passes children through.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
