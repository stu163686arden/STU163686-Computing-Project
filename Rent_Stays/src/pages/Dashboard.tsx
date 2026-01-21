import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Navbar from "@/components/customer/Navbar";
import Footer from "@/components/customer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Loader2, Home, Phone, MapPin, GraduationCap,
    BookOpen, CheckCircle, Edit2, User
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { BookingCard } from "@/components/dashboard/BookingCard";

interface TenantData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    university?: string;
    address?: string;
}

const Dashboard = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [tenant, setTenant] = useState<TenantData | null>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const navigate = useNavigate();
    const { toast } = useToast();

    // Edit Profile State
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        university: "",
        address: "",
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/");
                return;
            }
            setSession(session);
            fetchDashboardData(session.user.id);
        };

        checkAuth();
    }, [navigate]);

    const fetchDashboardData = async (userId: string) => {
        try {
            // Fetch Profile Data
            // First try to check 'profiles' table which is more reliable for user data than 'tenants' (legacy?)
            // But per previous code, we used 'tenants'. Let's check both or stick to tenants for now if that's where data lives.
            // The previous code fetched from 'tenants' using userId as ID.
            const { data: tenantData, error: tenantError } = await supabase
                .from("tenants")
                .select("*")
                .eq("id", userId)
                .single();

            // If tenant record not found, we might fallback to auth metadata context
            const { data: { session } } = await supabase.auth.getSession();
            const metadata = session?.user.user_metadata || {};

            let currentTenant: TenantData = {
                first_name: metadata.first_name || "",
                last_name: metadata.last_name || "",
                email: session?.user.email || "",
                phone: metadata.phone || null,
                university: metadata.university || "Not Provided",
                address: metadata.address || "Not Provided",
            };

            if (tenantData) {
                currentTenant = {
                    ...currentTenant,
                    ...tenantData, // Override with DB data if exists
                    university: metadata.university || currentTenant.university, // Metadata might be fresher for these fields if not in DB
                    address: metadata.address || currentTenant.address,
                };
            }

            setTenant(currentTenant);
            setEditForm({
                first_name: currentTenant.first_name,
                last_name: currentTenant.last_name,
                phone: currentTenant.phone || "",
                university: currentTenant.university || "",
                address: currentTenant.address || "",
            });

            // Fetch Bookings
            const { data: bookingsData, error: bookingsError } = await supabase
                .from("bookings")
                .select(`
                    *,
                    properties (
                        title,
                        address,
                        city,
                        images,
                        price
                    )
                `)
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (bookingsError) throw bookingsError;
            setBookings(bookingsData || []);

        } catch (error: any) {
            console.error("Dashboard Error:", error);
            // Don't show error toast on first load if it's just missing profile data, 
            // but for Bookings fetch error we should care.
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!session) return;
        setIsSaving(true);
        try {
            // Update Supabase Auth Metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    first_name: editForm.first_name,
                    last_name: editForm.last_name,
                    university: editForm.university,
                    address: editForm.address,
                    phone: editForm.phone,
                }
            });
            if (authError) throw authError;

            // Try to update Tenants Table if it exists
            const { error: dbError } = await supabase
                .from("tenants")
                .upsert({
                    id: session.user.id,
                    email: session.user.email,
                    first_name: editForm.first_name,
                    last_name: editForm.last_name,
                    phone: editForm.phone,
                });

            if (dbError) console.warn("Tenant DB update failed (non-critical):", dbError);

            // Update Local State
            setTenant(prev => prev ? ({
                ...prev,
                first_name: editForm.first_name,
                last_name: editForm.last_name,
                phone: editForm.phone,
                university: editForm.university,
                address: editForm.address,
            }) : null);

            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully.",
            });
            setIsEditProfileOpen(false);

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: error.message,
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                Welcome back, <span className="text-primary">{tenant?.first_name}</span>
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Manage your bookings and stay.
                            </p>
                        </div>
                        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] glass-card border-white/20">
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-first">First Name</Label>
                                            <Input
                                                id="edit-first"
                                                value={editForm.first_name}
                                                onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-last">Last Name</Label>
                                            <Input
                                                id="edit-last"
                                                value={editForm.last_name}
                                                onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-phone">Phone Number</Label>
                                        <Input
                                            id="edit-phone"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-uni">University</Label>
                                        <Input
                                            id="edit-uni"
                                            value={editForm.university}
                                            onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-addr">Address</Label>
                                        <Input
                                            id="edit-addr"
                                            value={editForm.address}
                                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleUpdateProfile} disabled={isSaving}>
                                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save changes
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Tabs */}
                        <div className="lg:col-span-2">
                            <Tabs defaultValue="bookings" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-secondary/30 mb-6">
                                    <TabsTrigger value="bookings" className="py-2">Bookings</TabsTrigger>
                                    <TabsTrigger value="property-guide" className="py-2">Property Guide</TabsTrigger>
                                    <TabsTrigger value="tenant-guide" className="py-2">Tenant Guide</TabsTrigger>
                                </TabsList>

                                {/* BOOKINGS TAB */}
                                <TabsContent value="bookings" className="space-y-6">
                                    {bookings.length > 0 ? (
                                        bookings.map((booking) => (
                                            <BookingCard key={booking.id} booking={booking} />
                                        ))
                                    ) : (
                                        <div className="text-center py-12 border rounded-xl bg-card/40 border-dashed">
                                            <Home className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                                            <h3 className="text-lg font-medium mb-1">No Bookings Yet</h3>
                                            <p className="text-muted-foreground mb-4">You haven't made any booking requests yet.</p>
                                            <Button onClick={() => navigate("/")}>Browse Properties</Button>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* PROPERTY GUIDE TAB */}
                                <TabsContent value="property-guide">
                                    <Card className="glass-card border-white/20">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <BookOpen className="w-5 h-5 text-primary" />
                                                Property Guide & FAQs
                                            </CardTitle>
                                            <CardDescription>Everything you need to know about your unit.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <h3 className="font-semibold text-lg">Wi-Fi Connection</h3>
                                                <p className="text-muted-foreground text-sm">Network: NestFinder_Guest<br />Password: welcome_home_2024</p>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="font-semibold text-lg">Trash Disposal</h3>
                                                <p className="text-muted-foreground text-sm">Trash collection is every Tuesday. Please leave bins outside your door by 8 AM.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="font-semibold text-lg">Laundry Facilities</h3>
                                                <p className="text-muted-foreground text-sm">Located on the ground floor. Open 24/7. Requires key fob for entry.</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* TENANT GUIDE TAB */}
                                <TabsContent value="tenant-guide">
                                    <Card className="glass-card border-white/20">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-primary" />
                                                Community Guidelines
                                            </CardTitle>
                                            <CardDescription>Rules to ensure a great experience for everyone.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-4">
                                                <li className="flex gap-3">
                                                    <span className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center text-xs font-bold">1</span>
                                                    <p className="text-sm">Quiet hours are from 10 PM to 7 AM every day. Please keep noise levels down.</p>
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="bg-primary/10 text-primary rounded-full p-1 h-6 w-6 flex items-center justify-center text-xs font-bold">2</span>
                                                    <p className="text-sm">No smoking inside the units or common areas. Designated smoking areas are available outside.</p>
                                                </li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                            </Tabs>
                        </div>

                        {/* Right Column: Profile (Sticky) */}
                        <div className="lg:col-span-1">
                            <Card className="glass-card border-white/20 h-fit sticky top-24">

                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-primary" />
                                        My Profile
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                                        <p className="font-semibold">{tenant?.first_name} {tenant?.last_name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                                        <p className="font-medium break-all">{tenant?.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-primary" />
                                            <span>{tenant?.phone || "Not Provided"}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">University</p>
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-primary" />
                                            <span>{tenant?.university}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Current Address</p>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <span>{tenant?.address}</span>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <Button variant="outline" className="w-full" onClick={() => setIsEditProfileOpen(true)}>
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;
