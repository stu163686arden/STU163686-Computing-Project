import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    trigger?: React.ReactNode;
    defaultUserType?: "user" | "admin";
}

const AuthModal = ({ isOpen, onClose, trigger, defaultUserType = "user" }: AuthModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    // Sign In State
    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");

    // Sign Up State
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [university, setUniversity] = useState("");
    const [address, setAddress] = useState("");

    const isUser = defaultUserType === "user";

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data: { user }, error } = await supabase.auth.signInWithPassword({
                email: signInEmail,
                password: signInPassword,
            });
            if (error) throw error;

            toast({
                title: "Welcome back!",
                description: "You have successfully signed in.",
            });

            // Check User Role from metadata & Redirect
            if (user) {
                const userType = user.user_metadata?.user_type;
                if (userType === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }

            onClose();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Invalid login credentials.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: signUpEmail,
                password: signUpPassword,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        university: isUser ? university : undefined, // Only for users
                        address: address,
                        phone: phone,
                        user_type: defaultUserType, // Pass to trigger
                        full_name: `${firstName} ${lastName}`
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                // Keep tenant record creation for backward compatibility or specific tenant data
                if (isUser) {
                    const { error: dbError } = await supabase.from("tenants").insert({
                        id: data.user.id,
                        email: signUpEmail,
                        first_name: firstName,
                        last_name: lastName,
                        phone: phone,
                    });

                    if (dbError) {
                        console.error("Error creating tenant record:", dbError);
                        // Don't block auth success if DB fails, but warn
                    }
                }

                toast({
                    title: "Account created!",
                    description: "Please check your email to verify your account.",
                });
                onClose();
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px] glass-card border-white/20">
                <div className="flex flex-col items-center justify-center py-4 space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                        <Building2 className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-bold tracking-tight">
                            Rent<span className="text-primary">&</span>Stay
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {isUser ? "Tenant / User Portal" : "Admin / Manager Portal"}
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin">
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signin-email">Email</Label>
                                <Input
                                    id="signin-email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={signInEmail}
                                    onChange={(e) => setSignInEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signin-password">Password</Label>
                                <Input
                                    id="signin-password"
                                    type="password"
                                    value={signInPassword}
                                    onChange={(e) => setSignInPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isUser ? "Sign In" : "Admin Login"}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup">
                        <form onSubmit={handleSignUp} className="space-y-4 h-[400px] overflow-y-auto pr-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstname">First Name</Label>
                                    <Input
                                        id="firstname"
                                        placeholder="John"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastname">Last Name</Label>
                                    <Input
                                        id="lastname"
                                        placeholder="Doe"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={signUpEmail}
                                    onChange={(e) => setSignUpEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input
                                    id="signup-password"
                                    type="password"
                                    value={signUpPassword}
                                    onChange={(e) => setSignUpPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    placeholder="+1 234 567 890"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            {isUser && (
                                <div className="space-y-2 animate-fade-in">
                                    <Label htmlFor="university">University</Label>
                                    <Input
                                        id="university"
                                        placeholder="University Name"
                                        value={university}
                                        onChange={(e) => setUniversity(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="address">Current Address</Label>
                                <Input
                                    id="address"
                                    placeholder="123 Main St"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Create Account
                            </Button>
                        </form>
                    </TabsContent>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        type="button"
                        className="w-full"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Google
                    </Button>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
