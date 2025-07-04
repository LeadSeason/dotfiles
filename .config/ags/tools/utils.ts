
export function truncateText(text: string, maxLength: number = 60): string {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
}

export function secondsToTime(t: number): string {
        /* @ts-expect-error */
        const date = new Date(null);
        date.setSeconds(t); // specify value for SECONDS here
        return date.toISOString().slice(11, 19);
}