import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Partials/Sidebar';
import Header from '../components/Partials/Header';
import Footer from '../components/Partials/Footer';
import { useState } from 'react';

/**
 * DashboardLayout - Reusable layout component with Sidebar, Header, and Footer
 * Use this layout for all authenticated/dashboard pages
 * The <Outlet /> component renders the child route's content
 */
export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Header */}
                <Header onMenuClick={() => setSidebarOpen(true)} />

                {/* Page Content - This is where child routes render */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}
