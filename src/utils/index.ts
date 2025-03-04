export const safeAssign: <T extends object>(
  target: T,
  source: Partial<T>
) => T = Object.assign;
