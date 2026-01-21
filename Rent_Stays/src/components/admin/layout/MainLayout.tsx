import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { AdminHeader } from "./AdminHeader";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={cn(
          "min-h-screen transition-all duration-300 flex flex-col",
          collapsed ? "pl-20" : "pl-64"
        )}
      >
        <AdminHeader />
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
