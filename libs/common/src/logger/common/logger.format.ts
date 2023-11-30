import { TimeDifference } from '../../constants';
import { format } from 'winston';

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  const timezoneOffset =
    date.getTimezoneOffset() / TimeDifference.FromUTCInHours;
  const timezoneOffsetHours = Math.floor(timezoneOffset);
  const timezoneOffsetMinutes = Math.abs(
    (timezoneOffset - timezoneOffsetHours) * TimeDifference.FromUTCInHours,
  );

  const formattedTime = date.toLocaleString(undefined, {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return `${formattedTime} (UTC${
    timezoneOffsetHours >= 0 ? '+' : '-'
  }${Math.abs(timezoneOffsetHours)
    .toString()
    .padStart(2, '0')}:${timezoneOffsetMinutes.toString().padStart(2, '0')})`;
}

export const customFormat = format.printf(
  ({ timestamp, level, stack, message }) => {
    return `${formatTimestamp(timestamp)} - [${level
      .toUpperCase()
      .padEnd(7)}] - ${stack || message}`;
  },
);
