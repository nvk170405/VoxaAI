// Test setup file for Vitest
import '@testing-library/jest-dom';
import React from 'react';

// Mock Next.js router
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
    default: function MockImage(props: { src: string; alt: string;[key: string]: unknown }) {
        return React.createElement('img', props);
    },
}));

// Mock Firebase
vi.mock('@/lib/firebaseConfig', () => ({
    auth: {
        currentUser: null,
        onAuthStateChanged: vi.fn(),
    },
    db: {},
}));

// Mock useAuth hook
vi.mock('@/context/AuthContext', () => ({
    useAuth: () => ({
        user: null,
        subscription: 'basic',
        loading: false,
        login: vi.fn(),
        logout: vi.fn(),
    }),
    AuthProvider: function MockAuthProvider({ children }: { children: React.ReactNode }) {
        return children;
    },
}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});
