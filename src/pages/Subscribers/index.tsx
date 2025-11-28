import Table, { type Column, type TableAction } from '../../components/UI/Table';
import { useEffect } from 'react';
import { searchUsers } from '../../services/users';
interface Subscriber {
    id: number;
    name: string;
    apiKey: string;
    status: 'active' | 'inactive';
    lastSync: string;
    requestCount: number;
}

export default function Subscribers() {
    // Sample data - replace with your actual data fetching
    useEffect(() => {
        const fetchSubscribers = async () => {
            const subscribers = await searchUsers({ role: 'subscriber' });
            console.log(subscribers);
            return subscribers;
        };
        fetchSubscribers();
    }, []);

    const subscribers: Subscriber[] = [

        {
            id: 1,
            name: 'ExchangeRate-API',
            apiKey: 'sk_live_***************',
            status: 'active',
            lastSync: '2025-11-26 14:30:00',
            requestCount: 1234,
        },
        {
            id: 2,
            name: 'CurrencyLayer',
            apiKey: 'sk_live_***************',
            status: 'active',
            lastSync: '2025-11-26 14:25:00',
            requestCount: 856,
        },
        {
            id: 3,
            name: 'Fixer.io',
            apiKey: 'sk_live_***************',
            status: 'inactive',
            lastSync: '2025-11-25 10:15:00',
            requestCount: 423,
        },
    ];

    // Define columns
    const columns: Column<Subscriber>[] = [
        {
            key: 'name',
            header: 'Subscriber Name',
            sortable: true,
            render: (subscriber) => (
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                        {subscriber.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-white">{subscriber.name}</p>
                        <p className="text-xs text-gray-400">ID: {subscriber.id}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'apiKey',
            header: 'API Key',
            render: (provider) => (
                <code className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 font-mono">
                    {provider.apiKey}
                </code>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (provider) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${provider.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                        }`}
                >
                    {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                </span>
            ),
        },
        {
            key: 'lastSync',
            header: 'Last Sync',
            sortable: true,
            render: (provider) => (
                <div>
                    <p className="text-white">{provider.lastSync.split(' ')[0]}</p>
                    <p className="text-xs text-gray-400">{provider.lastSync.split(' ')[1]}</p>
                </div>
            ),
        },
        {
            key: 'requestCount',
            header: 'Requests',
            sortable: true,
            render: (provider) => (
                <span className="font-semibold text-purple-400">
                    {provider.requestCount.toLocaleString()}
                </span>
            ),
        },
    ];

    // Define actions
    const actions: TableAction<Subscriber>[] = [
        {
            label: 'Edit',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            onClick: (provider) => {
                console.log('Edit provider:', provider);
                // Implement edit logic
            },
            variant: 'secondary',
        },
        {
            label: 'Delete',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            onClick: (provider) => {
                console.log('Delete provider:', provider);
                // Implement delete logic
            },
            variant: 'danger',
        },
    ];

    const handleRowClick = (subscriber: Subscriber) => {
        console.log('Row clicked:', subscriber);
        // Navigate to detail page or show modal
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Exchange Providers</h1>
                    <p className="text-gray-400">Manage your exchange rate API providers</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Provider</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-400 text-sm">Total Providers</h3>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white">{subscribers.length}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-400 text-sm">Active Providers</h3>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {subscribers.filter((p) => p.status === 'active').length}
                    </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-400 text-sm">Total Requests</h3>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {subscribers.reduce((sum, p) => sum + p.requestCount, 0).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Table */}
            <Table
                data={subscribers}
                columns={columns}
                actions={actions}
                onRowClick={handleRowClick}
                searchable
                searchPlaceholder="Search subscribers..."
                pagination
                itemsPerPage={10}
            />
        </div>
    );
}
