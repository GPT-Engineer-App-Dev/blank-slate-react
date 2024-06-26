import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const queryClient = new QueryClient();
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query: any) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

// TYPES SECTION
export type Event = {
    id: number;
    created_at: string;
    name: string;
    date: string;
    description: string;
    venue_id: number;
    venue?: Venue;
    comments?: Comment[];
};

export type Comment = {
    id: number;
    created_at: string;
    content: string;
    event_id: number;
    event?: Event;
};

export type Venue = {
    id: number;
    name: string;
    location: string;
    description: string;
    created_at: string;
    updated_at: string;
    events?: Event[];
};

// HOOKS SECTION
export const useEvents = () => useQuery({
    queryKey: ['events'],
    queryFn: () => fromSupabase(supabase.from('events').select('*, venue:venues(*), comments:comments(*)')),
});

export const useAddEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newEvent: Event) => fromSupabase(supabase.from('events').insert([newEvent])),
        onSuccess: () => {
            queryClient.invalidateQueries('events');
        },
    });
};

export const useComments = (eventId: number) => useQuery({
    queryKey: ['comments', eventId],
    queryFn: () => fromSupabase(supabase.from('comments').select('*').eq('event_id', eventId)),
});

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newComment: Comment) => fromSupabase(supabase.from('comments').insert([newComment])),
        onSuccess: () => {
            queryClient.invalidateQueries('comments');
        },
    });
};

export const useVenues = () => useQuery({
    queryKey: ['venues'],
    queryFn: () => fromSupabase(supabase.from('venues').select('*, events:events(*)')),
});

export const useAddVenue = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newVenue: Venue) => fromSupabase(supabase.from('venues').insert([newVenue])),
        onSuccess: () => {
            queryClient.invalidateQueries('venues');
        },
    });
};
