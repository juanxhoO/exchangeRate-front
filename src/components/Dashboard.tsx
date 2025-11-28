import { useState } from 'react';
import Sidebar from './Partials/Sidebar';
import Header from './Partials/Header';
import Footer from './Partials/Footer';

interface DashboardProps {
    children: React.ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Header */}
                <Header onMenuClick={() => setSidebarOpen(true)} />

                {/* Page Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}
