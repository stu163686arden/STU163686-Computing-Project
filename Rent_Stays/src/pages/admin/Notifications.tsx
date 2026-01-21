import { Bell, Check, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const notifications = [
    {
        id: 1,
        title: "New Property Inquiry",
        message: "Someone inquired about 'Luxury Downtown Apartment'",
        time: "2 hours ago",
        type: "info",
        read: false,
    },
    {
        id: 2,
        title: "Rent Payment Received",
        message: "John Doe paid rent for October",
        time: "5 hours ago",
        type: "success",
        read: true,
    },
    {
        id: 3,
        title: "Maintenance Request",
        message: "Leak reported in Unit 4B",
        time: "1 day ago",
        type: "warning",
        read: true,
    },
];

export default function Notifications() {
    return (
        <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-header">Notifications</h1>
                    <p className="text-muted-foreground mt-2">
                        Stay updated with latest activities
                    </p>
                </div>
                <Button variant="outline" size="sm">
                    Mark all as read
                </Button>
            </div>

            <div className="space-y-4">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={cn(
                            "flex items-start gap-4 p-4 rounded-xl border transition-all hover:bg-muted/50",
                            notification.read ? "bg-card border-border" : "bg-accent/5 border-accent/20"
                        )}
                    >
                        <div className={cn(
                            "mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            notification.type === 'success' && "bg-success/10 text-success",
                            notification.type === 'warning' && "bg-warning/10 text-warning",
                            notification.type === 'info' && "bg-info/10 text-info",
                        )}>
                            {notification.type === 'success' && <Check className="w-4 h-4" />}
                            {notification.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                            {notification.type === 'info' && <Info className="w-4 h-4" />}
                        </div>

                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className={cn("font-medium", !notification.read && "text-foreground")}>
                                    {notification.title}
                                </p>
                                <span className="text-xs text-muted-foreground">{notification.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {notification.message}
                            </p>
                        </div>

                        {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                        )}
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No notifications yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
