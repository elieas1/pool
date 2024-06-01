export const formatUsdc = (amount: number) => {
  return amount / 10 ** 18;
};

export const parseUsdc = (amount: number) => {
  return amount * 10 ** 18;
};
