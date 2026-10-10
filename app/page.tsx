import { routing } from "@/i18n/routing";

const target = `/${routing.defaultLocale}/`;

// Static export has no server redirects, so "/" is a tiny HTML page that
// forwards to the default language (meta refresh + JS, with a link fallback).
export default function RootRedirect() {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <link rel="canonical" href={target} />
        <script
          dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(target)})` }}
        />
      </head>
      <body style={{ background: "#0B0B0D" }}>
        <a href={target} style={{ color: "#F5F5F5" }}>
          Need for Cars
        </a>
      </body>
    </html>
  );
}
