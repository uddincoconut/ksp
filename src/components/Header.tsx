"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const pageTitles: Record<string, string> = {
  "/": "Home",
  "/members": "Members",
};

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-base-100 border-b border-base-300 shrink-0">
      <h2 className="text-lg font-semibold text-base-content">{title}</h2>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-base-content leading-none">
            {session?.user?.name ?? "—"}
          </p>
          <p className="text-xs text-base-content/50 mt-0.5">
            {session?.user?.email ?? ""}
          </p>
        </div>
        <div className="avatar avatar-placeholder">
          <div className="bg-primary text-primary-content rounded-full w-9">
            <span className="text-sm font-bold">
              {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
