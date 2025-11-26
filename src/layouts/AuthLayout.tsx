import { Outlet } from 'react-router-dom';

/**
 * AuthLayout - Simple layout for authentication pages (Login, Register, etc.)
 * No sidebar, header, or footer - just the page content
 */
export default function AuthLayout() {
    return (
        <div className="min-h-screen">
            <Outlet />
        </div>
    );
}
