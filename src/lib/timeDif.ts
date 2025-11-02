export const timeDif = (target: Date) => {
  const now = new Date();
  console.log(now);
  const diffMs = Math.abs(new Date(target).getTime() - now.getTime());
  return {
    ms: diffMs,
    seconds: diffMs / 1000,
    minutes: diffMs / (1000 * 60),
    hours: diffMs / (1000 * 60 * 60),
    days: diffMs / (1000 * 60 * 60 * 24),
  };
};
