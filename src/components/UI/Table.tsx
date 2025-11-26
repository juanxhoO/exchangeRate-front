import { ReactNode } from 'react';

export interface Column<T> {
    key: string;
    header: string;
    render?: (item: T, index: number) => ReactNode;
    sortable?: boolean;
    width?: string;
}

export interface TableAction<T> {
    label: string;
    icon?: ReactNode;
    onClick: (item: T) => void;
    variant?: 'primary' | 'secondary' | 'danger';
    show?: (item: T) => boolean;
}

export interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    actions?: TableAction<T>[];
    onRowClick?: (item: T) => void;
    loading?: boolean;
    emptyMessage?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    pagination?: boolean;
    itemsPerPage?: number;
    className?: string;
}

export default function Table<T extends Record<string, any>>({
    data,
    columns,
    actions,
    onRowClick,
    loading = false,
    emptyMessage = 'No data available',
    searchable = false,
    searchPlaceholder = 'Search...',
    pagination = true,
    itemsPerPage = 10,
    className = '',
}: TableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    // Filter data based on search
    const filteredData = searchable
        ? data.filter((item) =>
            columns.some((col) => {
                const value = item[col.key];
                return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
            })
        )
        : data;

    // Sort data
    const sortedData = sortConfig
        ? [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        })
        : filteredData;

    // Paginate data
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = pagination
        ? sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : sortedData;

    const handleSort = (key: string) => {
        setSortConfig((current) => {
            if (!current || current.key !== key) {
                return { key, direction: 'asc' };
            }
            if (current.direction === 'asc') {
                return { key, direction: 'desc' };
            }
            return null;
        });
    };

    const getActionButtonClass = (variant: TableAction<T>['variant'] = 'secondary') => {
        const baseClass = 'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1';
        const variants = {
            primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50',
            secondary: 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white',
            danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300',
        };
        return `${baseClass} ${variants[variant]}`;
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Search Bar */}
            {searchable && (
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder={searchPlaceholder}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                </div>
            )}

            {/* Table */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        style={{ width: column.width }}
                                        className={`px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:text-white transition-colors' : ''
                                            }`}
                                        onClick={() => column.sortable && handleSort(column.key)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span>{column.header}</span>
                                            {column.sortable && (
                                                <svg
                                                    className={`w-4 h-4 transition-transform ${sortConfig?.key === column.key
                                                        ? sortConfig.direction === 'asc'
                                                            ? 'rotate-180 text-purple-400'
                                                            : 'text-purple-400'
                                                        : 'text-gray-500'
                                                        }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            )}
                                        </div>
                                    </th>
                                ))}
                                {actions && actions.length > 0 && (
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <svg className="animate-spin h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="text-gray-400">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center space-y-2">
                                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <p className="text-gray-400">{emptyMessage}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-white/10' : 'hover:bg-white/5'
                                            }`}
                                        onClick={() => onRowClick?.(item)}
                                    >
                                        {columns.map((column) => (
                                            <td key={column.key} className="px-6 py-4 text-sm text-gray-300">
                                                {column.render ? column.render(item, index) : item[column.key]}
                                            </td>
                                        ))}
                                        {actions && actions.length > 0 && (
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    {actions.map((action, actionIndex) => {
                                                        if (action.show && !action.show(item)) return null;
                                                        return (
                                                            <button
                                                                key={actionIndex}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    action.onClick(item);
                                                                }}
                                                                className={getActionButtonClass(action.variant)}
                                                            >
                                                                {action.icon && <span>{action.icon}</span>}
                                                                <span>{action.label}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                            {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Previous
                            </button>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 rounded-lg transition-all duration-200 ${currentPage === page
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Import useState at the top
import { useState } from 'react';
