export const safeAssign: <T extends object>(
  target: T,
  source: Partial<T>
) => T = Object.assign;

export const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function* typewriter(
  text: string,
  delay = 100,
  maxDuration = 1000
): AsyncGenerator<string, void, unknown> {
  const finalDelay = Math.min(delay, maxDuration / text.length);
  let acc = "";
  for (const char of text) {
    yield (acc += char);
    await wait(finalDelay);
  }
}
