import { useTranslation } from '@app/hooks';
import dayjs from 'dayjs';

const ageCalc = (date?: Date | number): number => {
  const currentDate = dayjs().get('year');
  const userDate = dayjs(date).get('year');
  return currentDate - userDate;
};
function getBirthDateFromAge(age: number): Date {
  const date = dayjs().subtract(age, 'year'); // Subtracting years

  return date.format('12-31-YYYY') as unknown as Date;
}
function getAgeFromDateString(dateString: Date): number {
  const birthday = dayjs(dateString, 'MM/DD/YYYY'); // Parsing the date string
  const age = dayjs().diff(birthday, 'year'); // Calculating the difference in years
  return age as unknown as number;
}
function getGreeting(): string {
  const hour = dayjs().hour();

  if (hour >= 5 && hour < 12) return 'screens.home.goodMorning';
  else if (hour >= 12 && hour < 18) return 'screens.home.goodAfternoon';
  else return 'screens.home.goodEvening';
}
function formatDate(date?: Date) {
  const parsedDate = dayjs(date);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();

  if (parsedDate.isToday()) {
    return parsedDate.format('HH:mm');
  } else if (parsedDate.isYesterday()) {
    return t('lib.formatDate.yesterday');
  } else {
    return parsedDate.format('DD/MM/YYYY');
  }
}
const snapPoint = (
  value: number,
  velocity: number,
  points: ReadonlyArray<number>,
): number => {
  'worklet';
  const point = value + 0.2 * velocity;
  const deltas = points.map((p) => Math.abs(point - p));
  const minDelta = Math.min.apply(null, deltas);
  return Number(points.filter((p) => Math.abs(point - p) === minDelta)[0]);
};
function springConfig(damping: number, stiffness: number) {
  return {
    damping,
    stiffness,
    mass: 1,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  };
}

export default {
  ageCalc,
  getBirthDateFromAge,
  getAgeFromDateString,
  getGreeting,
  snapPoint,
  formatDate,
  springConfig,
};
