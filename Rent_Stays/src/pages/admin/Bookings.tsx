import { useEffect, useState } from "react";
import { BookingsTable } from "@/components/admin/bookings/BookingsTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { FileText, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Bookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchBookings = async () => {
        try {
            setLoading(true);

            // Get current admin user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast({
                    title: "Error",
                    description: "You must be logged in to view bookings.",
                    variant: "destructive",
                });
                return;
            }

            // Get property IDs owned by this admin
            const { data: properties, error: propError } = await supabase
                .from('properties')
                .select('id')
                .eq('owner_id', user.id);

            if (propError) throw propError;

            const propertyIds = properties?.map(p => p.id) || [];

            if (propertyIds.length === 0) {
                // Admin has no properties, so no bookings to show
                setBookings([]);
                return;
            }

            // Fetch bookings only for properties owned by this admin
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    property:property_id (
                        title,
                        address,
                        images
                    ),
                    profile:user_id (
                        full_name
                    )
                `)
                .in('property_id', propertyIds)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast({
                title: "Error",
                description: "Failed to load booking requests.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(booking => {
        const searchLower = searchQuery.toLowerCase();
        const propertyTitle = booking.property?.title?.toLowerCase() || "";
        const applicantName = booking.profile?.full_name?.toLowerCase() || "";

        return propertyTitle.includes(searchLower) ||
            applicantName.includes(searchLower);
    });

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-header">Booking Requests</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage incoming booking requests and contracts
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2" onClick={fetchBookings}>
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search bookings..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter Status
                </Button>
            </div>

            <BookingsTable
                bookings={filteredBookings}
                loading={loading}
                onUpdate={fetchBookings}
            />
        </div>
    );
}
