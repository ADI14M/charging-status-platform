import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from './supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

export interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    phone_number: string | null;
    avatar_url: string | null;
    role: 'user' | 'charger_owner' | 'admin';
    is_verified: boolean;
    trust_score: number;
}

interface AuthState {
    session: Session | null;
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    isAuthenticated: boolean;
}

export function useAuth(requireAuth: boolean = false, allowedRoles?: string[]) {
    const [authState, setAuthState] = useState<AuthState>({
        session: null,
        user: null,
        profile: null,
        loading: true,
        isAuthenticated: false,
    });
    const router = useRouter();

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    if (mounted) {
                        setAuthState({
                            session: null,
                            user: null,
                            profile: null,
                            loading: false,
                            isAuthenticated: false,
                        });
                        if (requireAuth) {
                            router.push('/login');
                        }
                    }
                    return;
                }

                // Fetch profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (mounted) {
                    // Check role access
                    if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
                        router.push('/');
                        return;
                    }

                    setAuthState({
                        session,
                        user: session.user,
                        profile: profile as UserProfile,
                        loading: false,
                        isAuthenticated: true,
                    });
                }
            } catch (error) {
                console.error('Auth error:', error);
                if (mounted) {
                    setAuthState(prev => ({ ...prev, loading: false }));
                    if (requireAuth) router.push('/login');
                }
            }
        };

        init();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_OUT') {
                    if (mounted) {
                        setAuthState({
                            session: null,
                            user: null,
                            profile: null,
                            loading: false,
                            isAuthenticated: false,
                        });
                        if (requireAuth) router.push('/login');
                    }
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [requireAuth, router]);

    const signOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return { ...authState, signOut };
}
