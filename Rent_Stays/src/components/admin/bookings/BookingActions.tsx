import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, FileText, Upload, MessageSquare } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookingActionsProps {
    bookingId: string;
    currentStatus: string;
    contractUrl: string | null;
    onUpdate: () => void;
}

export function BookingActions({ bookingId, currentStatus, contractUrl, onUpdate }: BookingActionsProps) {
    const [loading, setLoading] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [newContractUrl, setNewContractUrl] = useState("");
    const [adminNotes, setAdminNotes] = useState("");

    const handleStatusUpdate = async (newStatus: string, notes?: string) => {
        try {
            setLoading(true);
            const updateData: any = { status: newStatus };

            if (notes) {
                updateData.admin_notes = notes;
            }

            const { error } = await supabase
                .from('bookings')
                .update(updateData)
                .eq('id', bookingId);

            if (error) throw error;

            toast({
                title: "Success",
                description: `Booking status updated to ${newStatus.replace('_', ' ')}.`,
            });

            setIsNotesOpen(false);
            setAdminNotes("");
            onUpdate();
        } catch (error) {
            console.error('Error updating booking:', error);
            toast({
                title: "Error",
                description: "Failed to update booking status.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRequestDetails = () => {
        if (!adminNotes.trim()) {
            toast({
                title: "Error",
                description: "Please provide notes for the tenant.",
                variant: "destructive",
            });
            return;
        }
        handleStatusUpdate('request_additional_details', adminNotes);
    };

    const handleUploadContract = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('bookings')
                .update({ contract_url: newContractUrl })
                .eq('id', bookingId);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Contract uploaded successfully.",
            });

            setIsUploadOpen(false);
            setNewContractUrl("");
            onUpdate();
        } catch (error) {
            console.error('Error uploading contract:', error);
            toast({
                title: "Error",
                description: "Failed to upload contract.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {currentStatus === 'under_review' && (
                <>
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white gap-1"
                        onClick={() => handleStatusUpdate('approved')}
                        disabled={loading}
                    >
                        <Check className="w-4 h-4" />
                        Approve
                    </Button>

                    <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-1"
                                disabled={loading}
                            >
                                <MessageSquare className="w-4 h-4" />
                                Request Details
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Request Additional Details</DialogTitle>
                                <DialogDescription>
                                    Provide notes to the tenant about what additional information is needed.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Notes for Tenant</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Please provide the following documents..."
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        rows={5}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsNotesOpen(false)}>Cancel</Button>
                                <Button onClick={handleRequestDetails} disabled={loading || !adminNotes.trim()}>
                                    Send Request
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        onClick={() => handleStatusUpdate('rejected')}
                        disabled={loading}
                    >
                        <X className="w-4 h-4" />
                        Reject
                    </Button>
                </>
            )}

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Upload className="w-4 h-4" />
                        {contractUrl ? 'Update Contract' : 'Upload Contract'}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Contract</DialogTitle>
                        <DialogDescription>
                            Provide the URL for the lease agreement/contract for this booking.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="url">Contract URL</Label>
                            <Input
                                id="url"
                                placeholder="https://..."
                                value={newContractUrl}
                                onChange={(e) => setNewContractUrl(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                        <Button onClick={handleUploadContract} disabled={loading || !newContractUrl}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {contractUrl && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    asChild
                >
                    <a href={contractUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4" />
                        View Contract
                    </a>
                </Button>
            )}
        </div>
    );
}
