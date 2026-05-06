import Link from "next/link";

const footerLinks = {
  product: [
    { href: "/", label: "首頁" },
    { href: "/about", label: "關於" },
    { href: "/protocol", label: "Protocol" },
  ],
  legal: [
    { href: "/privacy", label: "隱私權政策" },
    { href: "/terms", label: "服務條款" },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 text-sm font-bold text-white dark:text-zinc-900">
                L
              </span>
              <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Life Protocol
              </span>
            </Link>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              用系統的方法，實踐你的人生。
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
              產品
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
              法律
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800 sm:flex-row">
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            © {new Date().getFullYear()} Life Protocol. All rights reserved.
          </p>
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            Made with intention 🌱
          </p>
        </div>
      </div>
    </footer>
  );
}
