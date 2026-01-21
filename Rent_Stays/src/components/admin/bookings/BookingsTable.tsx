import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { BookingActions } from "./BookingActions";
import { BookingDetailsModal } from "./BookingDetailsModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Calendar, MapPin, User } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface Booking {
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
}

interface BookingsTableProps {
    bookings: Booking[];
    loading: boolean;
    onUpdate: () => void;
}

export function BookingsTable({ bookings, loading, onUpdate }: BookingsTableProps) {
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleRowClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsDetailsOpen(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="text-center py-20 border rounded-lg bg-card/50">
                <p className="text-muted-foreground">No booking requests found.</p>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-md border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Property</TableHead>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Booking Details</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow
                                key={booking.id}
                                className="hover:bg-muted/5 cursor-pointer"
                                onClick={() => handleRowClick(booking)}
                            >
                                <TableCell className="max-w-[250px]">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-muted object-cover overflow-hidden flex-shrink-0 border border-border">
                                            {booking.property?.images?.[0] ? (
                                                <img
                                                    src={booking.property.images[0]}
                                                    alt={booking.property.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-secondary">
                                                    <Building2 className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium leading-none truncate" title={booking.property?.title}>
                                                {booking.property?.title || "Unknown Property"}
                                            </p>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                <span className="truncate max-w-[150px]">{booking.property?.address}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-border">
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {booking.profile?.full_name?.[0] || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">
                                                {booking.profile?.full_name || 'Unknown User'}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center text-sm">
                                            <Calendar className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                                            <span>Duration: {booking.duration}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            <span className="font-medium text-foreground/80">University:</span> {booking.university_name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            <span className="font-medium text-foreground/80">Reason:</span> {booking.reason_of_stay}
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge
                                        variant={
                                            booking.status === 'approved' ? 'default' :
                                                booking.status === 'rejected' ? 'destructive' : 'secondary'
                                        }
                                        className="capitalize shadow-sm"
                                    >
                                        {booking.status}
                                    </Badge>
                                    <div className="text-[10px] text-muted-foreground mt-1">
                                        {format(new Date(booking.created_at), 'MMM d, yyyy')}
                                    </div>
                                </TableCell>

                                <TableCell className="text-right">
                                    <BookingActions
                                        bookingId={booking.id}
                                        currentStatus={booking.status}
                                        contractUrl={booking.contract_url}
                                        onUpdate={onUpdate}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <BookingDetailsModal
                booking={selectedBooking}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                onUpdate={onUpdate}
            />
        </>
    );
}
