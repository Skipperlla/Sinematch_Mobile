export { default as Languages } from './languages';
export { default as ScreenSizes } from './screenSizes';
export { default as StorageKeys } from './storageKeys';
export { default as Pages } from './pages';
export { default as SubscribePlan } from './subscribePlans';
export { default as SwipeStatus } from './swipeStatus';
export { default as NotificationType } from './notificationType';
export { default as legalDocuments } from './legalDocuments';

export const baseURL = __DEV__
  ? 'http://192.168.1.4:8080'
  : 'https://api.sinematch.com';
