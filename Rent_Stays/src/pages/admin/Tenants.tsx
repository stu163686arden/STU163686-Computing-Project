import { useEffect, useState } from "react";
import { Search, Filter, MoreVertical, Phone, Mail, Eye, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Tenants() {
    const [tenants, setTenants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTenant, setSelectedTenant] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [tenantToDelete, setTenantToDelete] = useState<any>(null);

    useEffect(() => {
        fetchTenants();
    }, []);

    async function fetchTenants() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('tenants')
                .select(`
          *,
          properties (
            title,
            address
          )
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTenants(data || []);
        } catch (error: any) {
            console.error('Error fetching tenants:', error);
            toast({
                title: "Error",
                description: "Failed to load tenants.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    const handleViewDetails = (tenant: any) => {
        setSelectedTenant(tenant);
        setIsDetailsOpen(true);
    };

    const handleDeleteClick = (tenant: any) => {
        setTenantToDelete(tenant);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!tenantToDelete) return;

        try {
            const { error } = await supabase
                .from('tenants')
                .delete()
                .eq('id', tenantToDelete.id);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Tenant removed successfully.",
            });

            // Refresh the list
            fetchTenants();
        } catch (error: any) {
            console.error('Error deleting tenant:', error);
            toast({
                title: "Error",
                description: "Failed to remove tenant.",
                variant: "destructive",
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setTenantToDelete(null);
        }
    };

    const filteredTenants = tenants.filter(tenant =>
        tenant.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.properties?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-header">Tenants</h1>
                    <p className="text-muted-foreground mt-2">
                        View and manage your tenants
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tenants..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                </Button>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-medium text-muted-foreground">Tenant</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground">Property</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground">Contact</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground">Lease Info</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground">Rent</th>
                                <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-6 h-6 animate-spin text-accent" />
                                            <span>Loading tenants...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredTenants.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                        No tenants found.
                                    </td>
                                </tr>
                            ) : (
                                filteredTenants.map((tenant) => (
                                    <tr
                                        key={tenant.id}
                                        className="hover:bg-muted/5 transition-colors cursor-pointer"
                                        onClick={() => handleViewDetails(tenant)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">
                                                {tenant.first_name} {tenant.last_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{tenant.properties?.title || "No Property"}</div>
                                            <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                                {tenant.properties?.address}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Mail className="w-3 h-3 text-muted-foreground" />
                                                    {tenant.email}
                                                </div>
                                                {tenant.phone && (
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <Phone className="w-3 h-3 text-muted-foreground" />
                                                        {tenant.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                                {tenant.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span>Start: {tenant.lease_start_date ? new Date(tenant.lease_start_date).toLocaleDateString() : '-'}</span>
                                                <span>End: {tenant.lease_end_date ? new Date(tenant.lease_end_date).toLocaleDateString() : '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            ${tenant.monthly_rent?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewDetails(tenant);
                                                    }}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClick(tenant);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Remove Tenant
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tenant Details Modal */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Tenant Details</DialogTitle>
                        <DialogDescription>
                            Complete information about this tenant
                        </DialogDescription>
                    </DialogHeader>
                    {selectedTenant && (
                        <div className="space-y-6">
                            {/* Personal Information */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-sm text-muted-foreground">Personal Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Full Name</p>
                                        <p className="font-medium">{selectedTenant.first_name} {selectedTenant.last_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Status</p>
                                        <Badge variant={selectedTenant.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                            {selectedTenant.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-sm text-muted-foreground">Contact Information</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{selectedTenant.email}</span>
                                    </div>
                                    {selectedTenant.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">{selectedTenant.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Property Information */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-sm text-muted-foreground">Property Assignment</h3>
                                <div>
                                    <p className="font-medium">{selectedTenant.properties?.title || "No Property Assigned"}</p>
                                    {selectedTenant.properties?.address && (
                                        <p className="text-sm text-muted-foreground">{selectedTenant.properties.address}</p>
                                    )}
                                </div>
                            </div>

                            {/* Lease Information */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-sm text-muted-foreground">Lease Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Start Date</p>
                                        <p className="font-medium">
                                            {selectedTenant.lease_start_date
                                                ? new Date(selectedTenant.lease_start_date).toLocaleDateString()
                                                : 'Not set'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">End Date</p>
                                        <p className="font-medium">
                                            {selectedTenant.lease_end_date
                                                ? new Date(selectedTenant.lease_end_date).toLocaleDateString()
                                                : 'Not set'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Monthly Rent</p>
                                        <p className="font-medium text-lg">
                                            ${selectedTenant.monthly_rent?.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Created</p>
                                        <p className="font-medium">
                                            {selectedTenant.created_at
                                                ? new Date(selectedTenant.created_at).toLocaleDateString()
                                                : 'Unknown'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove {tenantToDelete?.first_name} {tenantToDelete?.last_name} from your tenant list.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Remove Tenant
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
