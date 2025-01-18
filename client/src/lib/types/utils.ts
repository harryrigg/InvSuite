export type User = {
  id: number;
  name: string;
  business_name: string;
  email: string;
  email_verified_at: Date;
};

export type ValidationErrorData<T> = {
  message: string;
  errors: Record<keyof T, string[]>;
};
