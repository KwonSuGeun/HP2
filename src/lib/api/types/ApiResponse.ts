export type ApiResponse<T> = {
  code: string | number;
  message: string;
  data: T;
};

