"use client";

import { usePathname } from "next/navigation";
import NavBar from "./navBar";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbar = pathname === "/login";

  return (
    <>
      {!hideNavbar && <NavBar />}
      {children}
    </>
  );
}
