export const formatUsdc = (amount: number) => {
  return amount / 10 ** 6;
};

export const parseUsdc = (amount: number) => {
  return amount * 10 ** 6;
};
