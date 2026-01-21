import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, University, Clock, FileText, Download, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface BookingCardProps {
    booking: {
        id: string;
        created_at: string;
        status: string;
        duration: string;
        reason_of_stay: string;
        university_name: string;
        contract_url: string | null;
        admin_notes: string | null;
        properties: {
            title: string;
            address: string;
            city: string;
            images: string[] | null;
            price: number;
        } | null;
    };
}

export function BookingCard({ booking }: BookingCardProps) {
    const { toast } = useToast();
    const property = booking.properties;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'default';
            case 'under_review': return 'secondary';
            case 'pending': return 'secondary';
            case 'rejected': return 'destructive';
            case 'request_additional_details': return 'outline';
            case 'confirmed': return 'outline';
            default: return 'secondary';
        }
    };

    const handleDownloadContract = () => {
        if (!booking.contract_url) return;
        window.open(booking.contract_url, '_blank');
        toast({
            title: "Opening Contract",
            description: "Opening lease agreement in a new tab...",
        });
    };

    return (
        <Card className="glass-card border-white/20 mb-6 overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(booking.status)} className="capitalize px-3 py-1">
                            {booking.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            Applied on {format(new Date(booking.created_at), 'PPP')}
                        </span>
                    </div>
                    {booking.status === 'approved' && booking.contract_url && (
                        <Button variant="outline" size="sm" onClick={handleDownloadContract} className="gap-2 h-8">
                            <FileText className="w-3 h-3" />
                            View Contract
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {property ? (
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden bg-muted border border-border">
                            {property.images && property.images.length > 0 ? (
                                <img
                                    src={property.images[0]}
                                    alt={property.title}
                                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-muted-foreground">No image available</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4 flex-1">
                            <div>
                                <h3 className="font-semibold text-xl leading-tight">{property.title}</h3>
                                <p className="text-muted-foreground flex items-center gap-1 mt-1 text-sm">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {property.address}, {property.city}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-foreground/80">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span>{booking.duration} Stay</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <University className="w-4 h-4 text-primary" />
                                    <span className="truncate" title={booking.university_name}>{booking.university_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Rent:</span>
                                    <span>£{property.price.toLocaleString()}/mo</span>
                                </div>
                            </div>

                            {booking.status === 'under_review' && (
                                <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 p-3 rounded-md text-sm flex items-start gap-2 border border-yellow-500/20">
                                    <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                                    <p>Your application is currently under review. We will notify you once an update is available.</p>
                                </div>
                            )}

                            {booking.status === 'request_additional_details' && booking.admin_notes && (
                                <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 p-4 rounded-md text-sm border border-amber-500/20">
                                    <div className="flex items-start gap-2 mb-2">
                                        <MessageSquare className="w-5 h-5 mt-0.5 shrink-0" />
                                        <p className="font-semibold">Additional Details Required</p>
                                    </div>
                                    <p className="ml-7 whitespace-pre-wrap">{booking.admin_notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-muted-foreground italic">Property details unavailable (Property may have been removed).</div>
                )}
            </CardContent>
        </Card>
    );
}
