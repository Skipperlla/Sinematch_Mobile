import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const useTimer = (endTime: dayjs.Dayjs) => {
  const calculateTimeLeft = () => {
    const diff = endTime.diff(dayjs());
    const timeLeft = dayjs.duration(diff);

    // If time is up, return "00:00:00"
    if (timeLeft.asSeconds() <= 0) {
      return '00:00:00';
    }

    const hours = timeLeft.hours().toString().padStart(2, '0');
    const minutes = timeLeft.minutes().toString().padStart(2, '0');
    const seconds = timeLeft.seconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // If time is up, clear interval
      if (newTimeLeft === '00:00:00') {
        clearInterval(timerInterval);
      }
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(timerInterval);
  }, [endTime]);

  return {
    timeLeft,
    isTimeUp: timeLeft === '00:00:00',
  };
};

export default useTimer;
