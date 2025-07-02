export const durationToMs = (str) => {
  const match = /^(\d+)([smhd])$/.exec(str);
  if (!match) throw new Error("Invalid JWT_EXPIRY format. Use '7d', '15m', etc.");

  const num = parseInt(match[1], 10);
  const unit = match[2];

  const unitMs = {
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000
  };

  return num * unitMs[unit];
};
