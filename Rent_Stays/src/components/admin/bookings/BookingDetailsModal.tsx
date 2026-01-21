import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Calendar, MapPin, User, FileText, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface BookingDetailsModalProps {
    booking: {
        id: string;
        created_at: string;
        status: string;
        duration: string;
        reason_of_stay: string;
        university_name: string;
        contract_url: string | null;
        admin_notes: string | null;
        property: {
            title: string;
            address: string;
            images: string[] | null;
        } | null;
        profile: {
            full_name: string;
        } | null;
    } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate?: () => void;
}

const STATUS_OPTIONS = [
    { value: 'under_review', label: 'Under Review', variant: 'secondary' as const },
    { value: 'approved', label: 'Approved', variant: 'default' as const },
    { value: 'rejected', label: 'Rejected', variant: 'destructive' as const },
    { value: 'request_additional_details', label: 'Request Additional Details', variant: 'outline' as const },
    { value: 'confirmed', label: 'Confirmed', variant: 'default' as const },
];

export function BookingDetailsModal({ booking, open, onOpenChange, onUpdate }: BookingDetailsModalProps) {
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    if (!booking) return null;

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === booking.status) return;

        setIsUpdatingStatus(true);
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', booking.id);

            if (error) throw error;

            toast({
                title: "Status Updated",
                description: `Booking status changed to ${STATUS_OPTIONS.find(s => s.value === newStatus)?.label}`,
            });

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast({
                title: "Error",
                description: "Failed to update booking status.",
                variant: "destructive",
            });
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const getStatusVariant = (status: string) => {
        return STATUS_OPTIONS.find(s => s.value === status)?.variant || 'secondary';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Booking Request Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Property Information */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            Property Information
                        </h3>
                        <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                            {booking.property?.images?.[0] && (
                                <img
                                    src={booking.property.images[0]}
                                    alt={booking.property.title}
                                    className="w-24 h-24 rounded-lg object-cover border"
                                />
                            )}
                            <div className="flex-1 space-y-2">
                                <h4 className="font-semibold text-lg">{booking.property?.title || 'Unknown Property'}</h4>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {booking.property?.address}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Applicant Information */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Applicant Information
                        </h3>
                        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border-2 border-border">
                                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                        {booking.profile?.full_name?.[0] || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-lg">{booking.profile?.full_name || 'Unknown User'}</p>
                                    <p className="text-sm text-muted-foreground">Tenant</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Booking Details */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Booking Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-2">Status</p>
                                <Select
                                    value={booking.status}
                                    onValueChange={handleStatusChange}
                                    disabled={isUpdatingStatus}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue>
                                            <Badge
                                                variant={getStatusVariant(booking.status)}
                                                className="capitalize"
                                            >
                                                {booking.status.replace(/_/g, ' ')}
                                            </Badge>
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={option.variant} className="capitalize">
                                                        {option.label}
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Application Date</p>
                                <p className="font-medium flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {format(new Date(booking.created_at), 'MMM d, yyyy')}
                                </p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                                <p className="font-medium">{booking.duration}</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">University</p>
                                <p className="font-medium">{booking.university_name}</p>
                            </div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-2">Reason for Stay</p>
                            <p className="text-sm">{booking.reason_of_stay}</p>
                        </div>
                    </div>

                    {/* Admin Notes */}
                    {booking.admin_notes && (
                        <>
                            <Separator />
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                    Admin Notes
                                </h3>
                                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                    <p className="text-sm whitespace-pre-wrap">{booking.admin_notes}</p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Contract */}
                    {booking.contract_url && (
                        <>
                            <Separator />
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Contract
                                </h3>
                                <a
                                    href={booking.contract_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-primary hover:underline"
                                >
                                    <FileText className="w-4 h-4" />
                                    View Lease Agreement
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
