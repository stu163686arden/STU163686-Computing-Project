import { PlusCircle, FileText, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const actions = [
  {
    title: "Add Property",
    description: "Create new listing",
    icon: PlusCircle,
    href: "/admin/properties/new",
    color: "bg-accent/20 text-accent-foreground hover:bg-accent hover:text-accent-foreground border border-accent/30",
  },
  {
    title: "New Tenant",
    description: "Register tenant",
    icon: Users,
    href: "/admin/tenants",
    color: "bg-success/10 text-success hover:bg-success hover:text-success-foreground",
  },
  {
    title: "View Reports",
    description: "Analytics & insights",
    icon: FileText,
    href: "/admin/reports",
    color: "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
  },
  {
    title: "Schedule",
    description: "Manage viewings",
    icon: Calendar,
    href: "/admin/settings",
    color: "bg-warning/10 text-warning hover:bg-warning hover:text-warning-foreground",
  },
];

export function QuickActions() {
  return (
    <div className="animate-fade-up stagger-6">
      <h3 className="section-title mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link
            key={action.title}
            to={action.href}
            className={cn(
              "p-4 rounded-xl transition-all duration-300 group hover:shadow-lg hover:-translate-y-1",
              action.color
            )}
          >
            <action.icon className="w-6 h-6 mb-3 transition-transform group-hover:scale-110" />
            <h4 className="font-medium">{action.title}</h4>
            <p className="text-xs opacity-70 mt-0.5">{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
