import { useState, useEffect } from "react";
import { Download, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function Reports() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-header">Reports & Analytics</h1>
                    <p className="text-muted-foreground mt-2">
                        View system activities and generate reports
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Calendar className="w-4 h-4" />
                        Date Range
                    </Button>
                    <Button className="gap-2 shadow-glow">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* We can reuse the ActivityFeed since user asked for "active reports which are also in dashboard" */}
                <div className="md:col-span-2">
                    <p className="text-muted-foreground">No reports available to display.</p>
                </div>
            </div>
        </div>
    );
}
