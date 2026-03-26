export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
export const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};
export const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1)
        return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1)
        return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1)
        return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1)
        return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1)
        return Math.floor(interval) + ' minutes ago';
    return Math.floor(seconds) + ' seconds ago';
};
export const truncateText = (text, length) => {
    if (text.length <= length)
        return text;
    return text.substring(0, length) + '...';
};
export const capitalizeFirstLetter = (text) => {
    if (!text)
        return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
};
export const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
export const validatePassword = (password) => {
    return password.length >= 6;
};
export const cn = (...classes) => {
    return classes.filter((c) => typeof c === 'string').join(' ');
};
