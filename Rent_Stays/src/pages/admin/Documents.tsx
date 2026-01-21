import { FileText, Download, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Documents() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-header">Documents</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage leases, contracts, and property documents
                    </p>
                </div>
                <Button className="gap-2 shadow-glow">
                    <Plus className="w-4 h-4" />
                    Upload Document
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search documents..." className="pl-10" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="group bg-card p-6 rounded-xl border border-border hover:border-accent/50 transition-all hover:shadow-md cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                                <FileText className="w-5 h-5" />
                            </div>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">Lease Agreement {i}.pdf</h3>
                        <p className="text-sm text-muted-foreground mb-4">Added 2 days ago • 2.4 MB</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="bg-muted px-2 py-1 rounded">Lease</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
