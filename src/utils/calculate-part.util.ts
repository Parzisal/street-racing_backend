export const calculatePartResaleFactor = (level: number): number => {
  // Economy: the higher the part level, the bigger the refund.
  return Math.min(0.35 + level * 0.1, 0.85);
};
