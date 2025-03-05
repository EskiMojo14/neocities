export const safeAssign: <T extends object>(
  target: T,
  source: Partial<T>
) => T = Object.assign;

export const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function* typewriter(text: string, delay = 50) {
  for (const char of text) {
    yield char;
    await wait(delay);
  }
}
