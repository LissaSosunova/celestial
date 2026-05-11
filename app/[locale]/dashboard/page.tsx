'use client';

import { Dashboard } from '@/components/Dashboard';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/lib/hooks/useUserProfile';

export default function DashboardPage() {
    const router = useRouter();
    const { profile, isLoading } = useUserProfile();

    const handleNavigate = (view: string) => {
        router.push(`/${view}`);
    };

    const handleSignOut = async () => {
        await fetch('/api/auth/signout', { method: 'POST' });
        router.push('/');
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-serif">Profile not found</h1>
                <button 
                    onClick={() => router.push('/onboarding')}
                    className="px-6 py-3 bg-dark text-white rounded-full text-xs uppercase tracking-ultra"
                >
                    Complete Onboarding
                </button>
            </div>
        );
    }

    return (
        <Dashboard
        />
    );
}