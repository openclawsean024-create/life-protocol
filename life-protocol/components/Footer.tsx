import Link from "next/link";

const footerLinks = [
  { href: "/", label: "首頁" },
  { href: "/about", label: "關於" },
  { href: "/protocol", label: "Protocol" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 text-sm font-bold text-white dark:text-zinc-900">
              L
            </span>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Life Protocol
            </span>
          </div>

          {/* Links */}
          <nav className="flex gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            © {new Date().getFullYear()} Life Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
