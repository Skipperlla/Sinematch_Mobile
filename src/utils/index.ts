export { default as rs } from './responsiveSize';
export { default as lib } from './lib';
export { default as DiscoveryContext } from './contexts/DiscoveryContext';
export { default as SocketContext } from './contexts/SocketContext';
export { default as swiperConfig } from './swiperConfig';

export function birthdayFormatter(
  birthday: string,
  defaultLanguage: string,
): string | Date {
  const split = birthday.split('/');

  if (defaultLanguage === 'tr')
    return new Date(`${split[2]}-${split[1]}-${split[0]}`);

  return new Date(`${split[2]}-${split[0]}-${split[1]}`);
}
