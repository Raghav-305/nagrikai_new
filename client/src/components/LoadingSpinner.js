import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const LoadingSpinner = ({ size = 'medium', text }) => {
    const sizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-12 h-12',
        large: 'w-16 h-16',
    };
    return (_jsxs("div", { className: "flex flex-col items-center justify-center gap-4", children: [_jsx("div", { className: `${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin` }), text && _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: text })] }));
};
export default LoadingSpinner;
