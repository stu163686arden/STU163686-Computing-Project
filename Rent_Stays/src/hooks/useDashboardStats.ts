import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
    totalProperties: number;
    activeTenants: number;
    monthlyRevenue: number;
    occupancyRate: number;
    propertiesChange: number;
    tenantsChange: number;
    revenueChange: number;
    occupancyChange: number;
}

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async (): Promise<DashboardStats> => {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const startOfLastMonth = new Date(startOfMonth);
            startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

            // 1. Properties Stats - Filter by current admin user
            const { count: totalProperties } = await supabase
                .from("properties")
                .select("*", { count: "exact", head: true })
                .eq("created_by", user.id);

            const { count: occupiedProperties } = await supabase
                .from("properties")
                .select("*", { count: "exact", head: true })
                .eq("created_by", user.id)
                .eq("status", "Occupied");

            // 2. Tenants Stats
            const { count: activeTenants } = await supabase
                .from("tenants")
                .select("*", { count: "exact", head: true })
                .eq("status", "Active");

            // 3. Revenue Stats (Current Month)
            const { data: currentMonthPayments } = await supabase
                .from("payments")
                .select("amount")
                .gte("payment_date", startOfMonth.toISOString());

            const monthlyRevenue = currentMonthPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

            // 4. Revenue Stats (Last Month) for Comparison
            const { data: lastMonthPayments } = await supabase
                .from("payments")
                .select("amount")
                .gte("payment_date", startOfLastMonth.toISOString())
                .lt("payment_date", startOfMonth.toISOString());

            const lastMonthRevenue = lastMonthPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

            // Calculations
            const occupancyRate = totalProperties ? Math.round((occupiedProperties || 0) / totalProperties * 100) : 0;

            const revenueChange = lastMonthRevenue
                ? Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
                : 100;

            // Mock changes for other stats as we don't have historical data tables for them easily accessible without more complex queries
            // In a real app, you'd likely have a 'daily_stats' table or similar snapshots

            return {
                totalProperties: totalProperties || 0,
                activeTenants: activeTenants || 0,
                monthlyRevenue,
                occupancyRate,
                propertiesChange: 12, // Placeholder logic: +12 this month
                tenantsChange: 5,     // Placeholder logic: +5 new tenants
                revenueChange,
                occupancyChange: 2.4  // Placeholder logic
            };
        },
    });
};
