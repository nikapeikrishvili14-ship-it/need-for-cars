"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "@/lib/nav";

type Props = {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
};

export default function NavLinks({ className, linkClassName = "", onNavigate }: Props) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <ul className={className}>
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`transition-colors hover:text-fg ${active ? "text-accent" : "text-muted"} ${linkClassName}`}
            >
              {t(item.key)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
