// Follow this type closely to ensure that your Supabase Edge Function is
// correctly configured.
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 20 // requests per window
const RATE_WINDOW = 60 * 1000 // 1 minute in milliseconds

function checkRateLimit(clientId: string): boolean {
    const now = Date.now()
    const entry = rateLimitMap.get(clientId)

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_WINDOW })
        return true
    }

    if (entry.count >= RATE_LIMIT) {
        return false
    }

    entry.count++
    return true
}

const SYSTEM_PROMPT = `You are a friendly and helpful property assistant for Rent&Stay, a student accommodation platform.

Your role is to:
1. Help students find rental properties near universities
2. Understand their preferences (budget, location, bedrooms, amenities)
3. Suggest suitable properties from the available listings
4. Provide helpful information about properties and the rental process

Guidelines:
- Be concise and friendly (under 150 words)
- When suggesting properties, mention the exact title, price, bedrooms, and key features
- If asked about a specific property, provide detailed information
- Format property suggestions clearly with bullet points
- If no matching properties exist, offer to notify them when suitable ones become available
- Always mention the property slug so users can view it at /property/{slug}
- Never reveal that you are an AI or discuss your programming`

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Get client identifier for rate limiting
        const clientId = req.headers.get('x-forwarded-for') ||
            req.headers.get('cf-connecting-ip') ||
            'anonymous'

        // Check rate limit
        if (!checkRateLimit(clientId)) {
            return new Response(
                JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }),
                {
                    status: 429,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        const { message, conversationHistory } = await req.json()

        if (!message || typeof message !== 'string') {
            return new Response(
                JSON.stringify({ error: 'Message is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const openaiKey = Deno.env.get('OPENAI_API_KEY')

        if (!openaiKey) {
            return new Response(
                JSON.stringify({ error: 'OpenAI API key not configured' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // Fetch available properties for context
        const { data: properties, error: dbError } = await supabase
            .from('properties')
            .select('title, slug, city, price, bedrooms, bathrooms, sqft, features, images')
            .eq('status', 'available')
            .limit(25)

        if (dbError) {
            console.error('Database error:', dbError)
        }

        // Build property context
        const propertyContext = properties?.map(p =>
            `• ${p.title} (slug: ${p.slug}): £${p.price}/month, ${p.bedrooms} bed, ${p.bathrooms} bath, ${p.sqft}m² in ${p.city}. Features: ${p.features?.slice(0, 3).join(', ') || 'N/A'}`
        ).join('\n') || 'No properties currently available.'

        // Prepare messages for OpenAI
        const messages = [
            {
                role: 'system',
                content: `${SYSTEM_PROMPT}\n\nAvailable Properties:\n${propertyContext}`
            },
            ...(conversationHistory || []).slice(-6), // Keep last 6 messages for context
            { role: 'user', content: message.slice(0, 500) } // Limit message length
        ]

        // Call OpenAI API
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages,
                max_tokens: 300,
                temperature: 0.7,
            }),
        })

        if (!openaiResponse.ok) {
            const errorText = await openaiResponse.text()
            console.error('OpenAI error:', errorText)
            return new Response(
                JSON.stringify({ error: 'Failed to get AI response' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const data = await openaiResponse.json()
        const assistantMessage = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

        return new Response(
            JSON.stringify({
                response: assistantMessage,
                properties: properties?.map(p => ({
                    title: p.title,
                    slug: p.slug,
                    price: p.price,
                    image: p.images?.[0] || null
                })) || []
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
