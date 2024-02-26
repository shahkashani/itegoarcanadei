import { format } from 'fecha';

export const getTime = (targetHour = 10) => {
  const localTime = new Date().toLocaleString('en-US', {
    timeZone: 'Europe/Paris',
  });

  const date = new Date(localTime);
  const targetTime = new Date(localTime);

  targetTime.setHours(
    targetHour,
    targetTime.getMinutes(),
    targetTime.getSeconds()
  );

  const difference = targetTime.getTime() - date.getTime();
  const differenceInHours = difference / (1000 * 60 * 60);

  date.setHours(-differenceInHours, date.getMinutes(), date.getSeconds());

  const title = format(date, 'hh:mm:ss A');

  return {
    title,
    seconds: date.getSeconds(),
    minutes: date.getMinutes(),
    hours: date.getHours(),
  };
};
