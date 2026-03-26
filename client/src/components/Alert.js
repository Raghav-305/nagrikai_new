import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MdClose, MdError, MdWarning, MdCheckCircle, MdInfo } from '@react-icons/all-files/md/index';
const Alert = ({ type, message, title, onClose, closeable = true }) => {
    const typeStyles = {
        success: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200',
        error: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200',
        warning: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
        info: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200',
    };
    const icons = {
        success: _jsx(MdCheckCircle, { size: 20 }),
        error: _jsx(MdError, { size: 20 }),
        warning: _jsx(MdWarning, { size: 20 }),
        info: _jsx(MdInfo, { size: 20 }),
    };
    return (_jsxs("div", { className: `border rounded-lg p-4 flex items-start gap-4 ${typeStyles[type]}`, children: [_jsx("div", { className: "flex-shrink-0 mt-0.5", children: icons[type] }), _jsxs("div", { className: "flex-1", children: [title && _jsx("h3", { className: "font-semibold mb-1", children: title }), _jsx("p", { children: message })] }), closeable && onClose && (_jsx("button", { onClick: onClose, className: "flex-shrink-0 text-inherit hover:opacity-70 transition", children: _jsx(MdClose, { size: 20 }) }))] }));
};
export default Alert;
