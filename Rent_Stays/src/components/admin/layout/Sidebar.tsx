import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Settings,
  Users,
  FileText,
  BarChart3,
  Bell,
  LogOut,
  ChevronLeft,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Properties", href: "/admin/properties", icon: Building2 },
  { name: "Add Property", href: "/admin/properties/new", icon: PlusCircle },
  { name: "Bookings", href: "/admin/bookings", icon: FileText },
  { name: "Tenants", href: "/admin/tenants", icon: Users },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
];

const secondaryNav = [
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar flex flex-col transition-all duration-300 ease-in-out z-50 border-r border-sidebar-border",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border h-[88px] hover:bg-sidebar-accent/50 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-glow shrink-0">
          <Building2 className="w-6 h-6 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden whitespace-nowrap">
            <h1 className="text-2xl font-bold tracking-tight text-sidebar-foreground leading-tight">
              Rent<span className="text-primary">&</span>Stay
            </h1>
            <p className="text-xs font-semibold text-sidebar-foreground/50 tracking-wide uppercase">Admin Panel</p>
          </div>
        )}
      </Link>

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 z-50"
      >
        <ChevronLeft className={cn(
          "w-4 h-4 text-muted-foreground transition-transform duration-300",
          collapsed && "rotate-180"
        )} />
      </button>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        <p className={cn(
          "px-4 text-xs font-bold uppercase tracking-wider text-sidebar-foreground/40 transition-opacity min-h-[1.5em]",
          collapsed ? "opacity-0 hidden" : "opacity-100"
        )}>
          Main Menu
        </p>
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href ||
            (item.href !== "/admin" && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "sidebar-link group flex items-center min-h-[44px]",
                isActive && "active",
                collapsed ? "justify-center px-2" : "px-4"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200 group-hover:scale-110 shrink-0",
                collapsed ? "" : "mr-3"
              )} />
              {!collapsed && (
                <span className="animate-fade-in font-medium">{item.name}</span>
              )}
              {isActive && !collapsed && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-sidebar-primary-foreground" />
              )}
            </Link>
          );
        })}

        <div className="my-4 border-t border-sidebar-border/50 mx-2" />

        {secondaryNav.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "sidebar-link group flex items-center min-h-[44px]",
                isActive && "active",
                collapsed ? "justify-center px-2" : "px-4"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200 group-hover:scale-110 shrink-0",
                collapsed ? "" : "mr-3"
              )} />
              {!collapsed && <span className="animate-fade-in font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
