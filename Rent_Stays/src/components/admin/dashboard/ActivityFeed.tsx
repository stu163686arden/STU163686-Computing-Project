import { Building2, UserPlus, DollarSign, Wrench, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "property",
    title: "New property listed",
    description: "Luxury Downtown Apartment added",
    time: "2 hours ago",
    icon: Building2,
    color: "bg-accent/10 text-accent",
  },
  {
    id: 2,
    type: "tenant",
    title: "Tenant moved in",
    description: "Sarah Johnson at Modern Studio Loft",
    time: "5 hours ago",
    icon: UserPlus,
    color: "bg-success/10 text-success",
  },
  {
    id: 3,
    type: "payment",
    title: "Payment received",
    description: "$3,500 from Unit #204",
    time: "Yesterday",
    icon: DollarSign,
    color: "bg-primary/10 text-primary",
  },
  {
    id: 4,
    type: "maintenance",
    title: "Maintenance scheduled",
    description: "Plumbing repair at Beachfront Villa",
    time: "2 days ago",
    icon: Wrench,
    color: "bg-warning/10 text-warning",
  },
];

export function ActivityFeed() {
  return (
    <div className="animate-fade-up stagger-5">
      <h3 className="section-title mb-4">Recent Activity</h3>
      <div className="space-y-1">
        {activities.map((activity, index) => (
          <div 
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
          >
            <div className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
              activity.color
            )}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {activity.description}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
