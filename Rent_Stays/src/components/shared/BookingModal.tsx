
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const bookingSchema = z.object({
    address: z.string().min(1, "Address is required"),
    reason_of_stay: z.string().min(1, "Reason for stay is required"),
    university_name: z.string().min(1, "University name is required"),
    duration: z.string().min(1, "Duration is required"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: string;
    propertyTitle: string;
}

const BookingModal = ({ isOpen, onClose, propertyId, propertyTitle }: BookingModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
    });

    const onSubmit = async (data: BookingFormValues) => {
        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error("Authentication Required", {
                    description: "Please log in to submit a booking request.",
                });
                return;
            }

            const { error } = await supabase
                .from("bookings")
                .insert({
                    property_id: propertyId,
                    user_id: user.id,
                    ...data,
                });

            if (error) throw error;

            toast.success("Request Under Process", {
                description: "Your booking request has been submitted successfully.",
            });
            reset();
            onClose();
        } catch (error) {
            console.error("Error submitting booking:", error);
            toast.error("Error", {
                description: "Failed to submit booking request. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Apply for {propertyTitle}</DialogTitle>
                    <DialogDescription>
                        Fill in your details below to submit a booking request.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="address">Current Address</Label>
                        <Input id="address" placeholder="123 Main St, City" {...register("address")} />
                        {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="university_name">University Name</Label>
                        <Input id="university_name" placeholder="University of Cape Town" {...register("university_name")} />
                        {errors.university_name && <p className="text-sm text-destructive">{errors.university_name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration of Stay</Label>
                        <Input id="duration" placeholder="e.g. 12 months" {...register("duration")} />
                        {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason_of_stay">Reason for Stay</Label>
                        <Textarea
                            id="reason_of_stay"
                            placeholder="Briefly explain why you are looking for accommodation..."
                            {...register("reason_of_stay")}
                        />
                        {errors.reason_of_stay && <p className="text-sm text-destructive">{errors.reason_of_stay.message}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Request
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BookingModal;
