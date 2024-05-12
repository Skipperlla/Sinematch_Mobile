export enum APIStatus {
  IDLE,
  PENDING,
  REJECTED,
  FULFILLED,
}

declare global {
  type APIError = {
    response: {
      data: {
        statusCode: number;
        error: {
          message: string;
          statusCode: number;
        };
      };
    };
  };
}
export type APIData<T> = {
  status: APIStatus;
  error: APIError | null;
  data: T | null;
};
