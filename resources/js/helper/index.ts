import moment from 'moment';

export const getRelativeTimeDifference = (givenDate: string, shortened: boolean = false): string => {

    const nowUtc = moment.utc();
    const thenUtc = moment.utc(new Date(givenDate));

    if (!thenUtc.isValid()) return 'Invalid date';

    const diffInSeconds = nowUtc.diff(thenUtc, 'seconds');

    if (diffInSeconds === 0) return 'Just now';
    if (diffInSeconds < 60) return shortened ? `${diffInSeconds}s` : `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;

    const diffInMinutes = nowUtc.diff(thenUtc, 'minutes');
    if (diffInMinutes < 60) return shortened ? `${diffInMinutes}m` : `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

    const diffInHours = nowUtc.diff(thenUtc, 'hours');
    if (diffInHours < 24) return shortened ? `${diffInHours}h` : `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = nowUtc.diff(thenUtc, 'days');
    if (diffInDays < 7) return shortened ? `${diffInDays}d` : `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    const diffInWeeks = nowUtc.diff(thenUtc, 'weeks');
    if (diffInWeeks < 4) return shortened ? `${diffInWeeks}w` : `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;

    const date = new Date(givenDate).toLocaleString('en', { month: 'short', day: '2-digit' });

    return date;
};