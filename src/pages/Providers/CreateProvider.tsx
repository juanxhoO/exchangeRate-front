import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface ProviderFormValues {
    name: string;
    apiKey: string;
    apiUrl: string;
    status: 'active' | 'inactive';
    description: string;
    rateLimit: number;
    timeout: number;
}

const validationSchema = Yup.object({
    name: Yup.string()
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must be less than 50 characters')
        .required('Provider name is required'),
    apiKey: Yup.string()
        .min(10, 'API key must be at least 10 characters')
        .required('API key is required'),
    apiUrl: Yup.string()
        .url('Must be a valid URL')
        .required('API URL is required'),
    status: Yup.string()
        .oneOf(['active', 'inactive'], 'Invalid status')
        .required('Status is required'),
    description: Yup.string()
        .max(200, 'Description must be less than 200 characters'),
    rateLimit: Yup.number()
        .min(1, 'Rate limit must be at least 1')
        .max(10000, 'Rate limit must be less than 10000')
        .required('Rate limit is required'),
    timeout: Yup.number()
        .min(1, 'Timeout must be at least 1 second')
        .max(60, 'Timeout must be less than 60 seconds')
        .required('Timeout is required'),
});

export default function CreateProvider() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik<ProviderFormValues>({
        initialValues: {
            name: '',
            apiKey: '',
            apiUrl: '',
            status: 'active',
            description: '',
            rateLimit: 100,
            timeout: 30,
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                // TODO: Replace with actual API call
                console.log('Form values:', values);

                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1500));

                // Show success message and navigate back
                alert('Provider created successfully!');
                navigate('/exchange-providers');
            } catch (error) {
                console.error('Error creating provider:', error);
                alert('Failed to create provider. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Exchange Provider</h1>
                    <p className="text-gray-400">Add a new exchange rate API provider to your system</p>
                </div>
                <button
                    onClick={() => navigate('/exchange-providers')}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Providers</span>
                </button>
            </div>

            {/* Form Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Provider Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                            Provider Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${formik.touched.name && formik.errors.name
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-white/10 focus:ring-purple-500'
                                }`}
                            placeholder="e.g., ExchangeRate-API"
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{formik.errors.name}</span>
                            </p>
                        )}
                    </div>

                    {/* API Key */}
                    <div>
                        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-200 mb-2">
                            API Key <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="apiKey"
                                name="apiKey"
                                type="password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.apiKey}
                                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${formik.touched.apiKey && formik.errors.apiKey
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-white/10 focus:ring-purple-500'
                                    }`}
                                placeholder="Enter your API key"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                        </div>
                        {formik.touched.apiKey && formik.errors.apiKey && (
                            <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{formik.errors.apiKey}</span>
                            </p>
                        )}
                    </div>

                    {/* API URL */}
                    <div>
                        <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-200 mb-2">
                            API URL <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="apiUrl"
                            name="apiUrl"
                            type="url"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.apiUrl}
                            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${formik.touched.apiUrl && formik.errors.apiUrl
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-white/10 focus:ring-purple-500'
                                }`}
                            placeholder="https://api.example.com/v1"
                        />
                        {formik.touched.apiUrl && formik.errors.apiUrl && (
                            <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{formik.errors.apiUrl}</span>
                            </p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-200 mb-2">
                            Status <span className="text-red-400">*</span>
                        </label>
                        <select
                            id="status"
                            name="status"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.status}
                            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-200 ${formik.touched.status && formik.errors.status
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-white/10 focus:ring-purple-500'
                                }`}
                        >
                            <option value="active" className="bg-slate-900">Active</option>
                            <option value="inactive" className="bg-slate-900">Inactive</option>
                        </select>
                        {formik.touched.status && formik.errors.status && (
                            <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{formik.errors.status}</span>
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${formik.touched.description && formik.errors.description
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-white/10 focus:ring-purple-500'
                                }`}
                            placeholder="Brief description of this provider..."
                        />
                        {formik.touched.description && formik.errors.description && (
                            <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{formik.errors.description}</span>
                            </p>
                        )}
                    </div>

                    {/* Rate Limit and Timeout - Two columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Rate Limit */}
                        <div>
                            <label htmlFor="rateLimit" className="block text-sm font-medium text-gray-200 mb-2">
                                Rate Limit (requests/min) <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="rateLimit"
                                name="rateLimit"
                                type="number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.rateLimit}
                                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${formik.touched.rateLimit && formik.errors.rateLimit
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-white/10 focus:ring-purple-500'
                                    }`}
                                placeholder="100"
                            />
                            {formik.touched.rateLimit && formik.errors.rateLimit && (
                                <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{formik.errors.rateLimit}</span>
                                </p>
                            )}
                        </div>

                        {/* Timeout */}
                        <div>
                            <label htmlFor="timeout" className="block text-sm font-medium text-gray-200 mb-2">
                                Timeout (seconds) <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="timeout"
                                name="timeout"
                                type="number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.timeout}
                                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${formik.touched.timeout && formik.errors.timeout
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-white/10 focus:ring-purple-500'
                                    }`}
                                placeholder="30"
                            />
                            {formik.touched.timeout && formik.errors.timeout && (
                                <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{formik.errors.timeout}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
                        <button
                            type="button"
                            onClick={() => navigate('/exchange-providers')}
                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !formik.isValid}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Creating...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Create Provider</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Info Card */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 className="text-blue-400 font-semibold mb-1">Provider Information</h3>
                        <p className="text-gray-300 text-sm">
                            Make sure to keep your API keys secure. The rate limit and timeout values help manage API usage and prevent overloading the provider's servers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
