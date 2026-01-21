import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Home } from "lucide-react";

const InterfaceSwitcher = () => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith("/admin");

    if (isAdmin) {
        // Show "View Customer Site" button in admin interface
        return (
            <Link to="/">
                <Button variant="outline" size="sm" className="gap-2">
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">Customer Site</span>
                </Button>
            </Link>
        );
    }

    // Show "Admin Dashboard" button in customer interface
    return (
        <Link to="/admin">
            <Button variant="outline" size="sm" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Admin Dashboard</span>
            </Button>
        </Link>
    );
};

export default InterfaceSwitcher;
