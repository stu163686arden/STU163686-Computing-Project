import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function SupabaseConnectionTest() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function testConnection() {
            try {
                // Test 1: Check if Supabase client is initialized
                if (!supabase) {
                    throw new Error('Supabase client not initialized');
                }

                // Test 2: Try to query the properties table
                const { data, error } = await supabase
                    .from('properties')
                    .select('count')
                    .limit(1);

                if (error) {
                    // If table doesn't exist yet, that's okay - connection is still working
                    if (error.message.includes('relation "properties" does not exist')) {
                        setStatus('success');
                        setMessage('✅ Connected to Supabase! (Database tables not created yet - run the SQL schema)');
                    } else {
                        throw error;
                    }
                } else {
                    setStatus('success');
                    setMessage('✅ Successfully connected to Supabase and database is ready!');
                }
            } catch (error: any) {
                setStatus('error');
                setMessage(`❌ Connection failed: ${error.message}`);
                console.error('Supabase connection error:', error);
            }
        }

        testConnection();
    }, []);

    return (
        <Card className="border-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
                    {status === 'success' && <CheckCircle2 className="w-5 h-5 text-success" />}
                    {status === 'error' && <XCircle className="w-5 h-5 text-destructive" />}
                    Supabase Connection Status
                </CardTitle>
                <CardDescription>
                    Testing connection to your Supabase backend
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className={`text-sm ${status === 'success' ? 'text-success' : status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {status === 'loading' ? 'Testing connection...' : message}
                </p>
            </CardContent>
        </Card>
    );
}
