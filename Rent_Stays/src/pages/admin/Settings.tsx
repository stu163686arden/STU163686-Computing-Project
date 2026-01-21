import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            <div>
                <h1 className="page-header">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account and application preferences
                </p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                    <div className="bg-card p-6 rounded-xl border border-border space-y-6">
                        <h3 className="text-lg font-semibold">Profile Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input defaultValue="Admin User" />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input defaultValue="admin@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input defaultValue="+1 (555) 000-0000" />
                            </div>
                            <div className="space-y-2">
                                <Label>Timezone</Label>
                                <Input defaultValue="UTC-5 (Eastern Time)" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button className="shadow-glow">Save Changes</Button>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border space-y-6">
                        <h3 className="text-lg font-semibold">Application Preferences</h3>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Dark Mode</Label>
                                <p className="text-sm text-muted-foreground">Toggle application theme</p>
                            </div>
                            <Switch />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Compact View</Label>
                                <p className="text-sm text-muted-foreground">Show more content on screen</p>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value="notifications" className="space-y-6">
                    <div className="bg-card p-6 rounded-xl border border-border space-y-6">
                        <h3 className="text-lg font-semibold">Email Notifications</h3>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>New Tenant Applications</Label>
                                <p className="text-sm text-muted-foreground">Receive emails for new applications</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Maintenance Requests</Label>
                                <p className="text-sm text-muted-foreground">Receive emails for new requests</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Payment Received</Label>
                                <p className="text-sm text-muted-foreground">Receive emails when rent is paid</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </div>
                </TabsContent>

                {/* Security */}
                <TabsContent value="security" className="space-y-6">
                    <div className="bg-card p-6 rounded-xl border border-border space-y-6">
                        <h3 className="text-lg font-semibold">Password</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Current Password</Label>
                                <Input type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label>New Password</Label>
                                <Input type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label>Confirm Password</Label>
                                <Input type="password" />
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button variant="outline">Update Password</Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
