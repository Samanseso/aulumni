import moment from 'moment';

export const getRelativeTimeDifference = (givenDate: string) => {
    
    const nowUtc = moment.utc();
    const thenUtc = moment.utc(new Date(givenDate));

    if (!thenUtc.isValid()) return 'Invalid date';

    const diffInSeconds = nowUtc.diff(thenUtc, 'seconds');

    if (diffInSeconds === 0) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;

    const diffInMinutes = nowUtc.diff(thenUtc, 'minutes');
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

    const diffInHours = nowUtc.diff(thenUtc, 'hours');
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = nowUtc.diff(thenUtc, 'days');
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    const diffInWeeks = nowUtc.diff(thenUtc, 'weeks');
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;

    const diffInMonths = nowUtc.diff(thenUtc, 'months');
    if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;

    const diffInYears = nowUtc.diff(thenUtc, 'years');
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};
