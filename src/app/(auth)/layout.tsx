import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
