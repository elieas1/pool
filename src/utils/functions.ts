import { toast } from "react-toastify";

export const formatUsdc = (amount: number) => {
  return amount / 10 ** 6;
};

export const parseUsdc = (amount: number) => {
  return amount * 10 ** 6;
};

export const handleError = (error: string) => {
  const result = error?.match(/@ (.*?) @/);

  if (result) {
    toast.error(result?.[1]);
  } else {
    toast.error("Operation failed");
  }
};
