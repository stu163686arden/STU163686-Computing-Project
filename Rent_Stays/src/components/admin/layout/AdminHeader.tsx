import { User, LogOut, Moon, Sun, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function AdminHeader() {
    const { setTheme, theme } = useTheme();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Try to get detailed profile if available, or fallback to metadata
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', user.id)
                    .single();

                const name = profile?.full_name || user.user_metadata?.full_name || "Admin User";
                const email = user.email || "";
                setUser({ name, email });
            }
        };
        getUser();
    }, []);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            toast({
                title: "Signed out",
                description: "You have been successfully signed out.",
            });
            // Use hard redirect instead of navigate() to ensure session is fully cleared
            window.location.href = "/";
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error signing out",
                description: error.message,
            });
        }
    };

    return (
        <header className="flex items-center justify-between px-8 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Left side greeting (optional, but requested "hello name") */}
            <div className="hidden md:block">
                {user && <h2 className="text-lg font-medium text-foreground">Hello, {user.name} 👋</h2>}
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Bell className="w-5 h-5" />
                </Button>

                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full border-border hover:border-primary hover:bg-primary/10 transition-all duration-300"
                        >
                            <User className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.name || "Admin"}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email || "loading..."}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to="/admin/settings" className="cursor-pointer">
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
