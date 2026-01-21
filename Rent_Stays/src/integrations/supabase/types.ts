export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            bookings: {
                Row: {
                    id: string
                    property_id: string
                    user_id: string | null
                    status: string
                    address: string
                    reason_of_stay: string
                    university_name: string
                    duration: string
                    created_at: string
                    updated_at: string
                    contract_url: string | null
                }
                Insert: {
                    id?: string
                    property_id: string
                    user_id?: string | null
                    status?: string
                    address: string
                    reason_of_stay: string
                    university_name: string
                    duration: string
                    created_at?: string
                    updated_at?: string
                    contract_url?: string | null
                }
                Update: {
                    id?: string
                    property_id?: string
                    user_id?: string | null
                    status?: string
                    address?: string
                    reason_of_stay?: string
                    university_name?: string
                    duration?: string
                    created_at?: string
                    updated_at?: string
                    contract_url?: string | null
                }
            },
            activities: {
                Row: {
                    id: string
                    type: string
                    title: string
                    description: string | null
                    property_id: string | null
                    tenant_id: string | null
                    payment_id: string | null
                    maintenance_id: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    type: string
                    title: string
                    description?: string | null
                    property_id?: string | null
                    tenant_id?: string | null
                    payment_id?: string | null
                    maintenance_id?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    type?: string
                    title?: string
                    description?: string | null
                    property_id?: string | null
                    tenant_id?: string | null
                    payment_id?: string | null
                    maintenance_id?: string | null
                    created_at?: string | null
                }
            }
            featured_properties: {
                Row: {
                    id: string
                    property_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    property_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    property_id?: string
                    created_at?: string
                }
            }
            maintenance_requests: {
                Row: {
                    id: string
                    property_id: string | null
                    tenant_id: string | null
                    title: string
                    description: string
                    priority: string | null
                    category: string | null
                    status: string | null
                    scheduled_date: string | null
                    completed_date: string | null
                    estimated_cost: number | null
                    actual_cost: number | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    property_id?: string | null
                    tenant_id?: string | null
                    title: string
                    description: string
                    priority?: string | null
                    category?: string | null
                    status?: string | null
                    scheduled_date?: string | null
                    completed_date?: string | null
                    estimated_cost?: number | null
                    actual_cost?: number | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    property_id?: string | null
                    tenant_id?: string | null
                    title?: string
                    description?: string
                    priority?: string | null
                    category?: string | null
                    status?: string | null
                    scheduled_date?: string | null
                    completed_date?: string | null
                    estimated_cost?: number | null
                    actual_cost?: number | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            payments: {
                Row: {
                    id: string
                    tenant_id: string | null
                    property_id: string | null
                    amount: number
                    payment_date: string
                    payment_method: string | null
                    status: string | null
                    description: string | null
                    transaction_id: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    tenant_id?: string | null
                    property_id?: string | null
                    amount: number
                    payment_date: string
                    payment_method?: string | null
                    status?: string | null
                    description?: string | null
                    transaction_id?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    tenant_id?: string | null
                    property_id?: string | null
                    amount?: number
                    payment_date?: string
                    payment_method?: string | null
                    status?: string | null
                    description?: string | null
                    transaction_id?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            properties: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    description: string | null
                    address: string
                    city: string
                    state: string
                    zip_code: string
                    price: number
                    promotional_price: number | null
                    category: string
                    bedrooms: number
                    bathrooms: number
                    sqft: number
                    status: string
                    available_from: string
                    is_featured: boolean | null
                    images: string[] | null
                    features: string[] | null
                    included_utilities: string[] | null
                    created_at: string | null
                    updated_at: string | null
                    owner_id: string | null
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    description?: string | null
                    address: string
                    city: string
                    state: string
                    zip_code: string
                    price: number
                    promotional_price?: number | null
                    category: string
                    bedrooms: number
                    bathrooms: number
                    sqft: number
                    status?: string
                    available_from: string
                    is_featured?: boolean | null
                    images?: string[] | null
                    features?: string[] | null
                    included_utilities?: string[] | null
                    created_at?: string | null
                    updated_at?: string | null
                    owner_id?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    description?: string | null
                    address?: string
                    city?: string
                    state?: string
                    zip_code?: string
                    price?: number
                    promotional_price?: number | null
                    category?: string
                    bedrooms?: number
                    bathrooms?: number
                    sqft?: number
                    status?: string
                    available_from?: string
                    is_featured?: boolean | null
                    images?: string[] | null
                    features?: string[] | null
                    included_utilities?: string[] | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            tenants: {
                Row: {
                    id: string
                    first_name: string
                    last_name: string
                    email: string
                    phone: string | null
                    property_id: string | null
                    lease_start_date: string | null
                    lease_end_date: string | null
                    monthly_rent: number | null
                    status: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    first_name: string
                    last_name: string
                    email: string
                    phone?: string | null
                    property_id?: string | null
                    lease_start_date?: string | null
                    lease_end_date?: string | null
                    monthly_rent?: number | null
                    status?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    first_name?: string
                    last_name?: string
                    email?: string
                    phone?: string | null
                    property_id?: string | null
                    lease_start_date?: string | null
                    lease_end_date?: string | null
                    monthly_rent?: number | null
                    status?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
        }
    }
}
