import moment from 'moment';

export const getRelativeTimeDifference = (givenDate: string) => {
    const now = moment();
    const diffInSeconds = now.diff(givenDate, 'seconds');

    if (diffInSeconds === 0) {
        return "Just now";
    }

    if (diffInSeconds < 60) {
        return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
    }

    const diffInMinutes = now.diff(givenDate, 'minutes');
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = now.diff(givenDate, 'hours');
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = now.diff(givenDate, 'days');
    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    const diffInWeeks = now.diff(givenDate, 'weeks');
    if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    }

    const diffInMonths = now.diff(givenDate, 'months');
    if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }

    const diffInYears = now.diff(givenDate, 'years');
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}