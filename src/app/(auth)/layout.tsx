import { ThemeToggle } from "@/components/toggle-mode";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <>
      <main>
        <ThemeToggle />
        {children}
      </main>
    </>
  );
}
