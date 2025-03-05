export const safeAssign: <T extends object>(
  target: T,
  source: Partial<T>
) => T = Object.assign;

export const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function* typewriter(
  text: string,
  {
    /** Time between each character
     * @default 100
     */
    interval = 100,
    /** Maximum duration of the animation
     * @default 1000
     */
    maxDuration = 1000,
    /** Delay before starting the animation
     * @default 0
     */
    delay = 0,
  } = {}
) {
  const finalInterval = Math.min(interval, maxDuration / text.length);
  let acc = "";
  await wait(delay);
  for (const char of text) {
    yield (acc += char);
    await wait(finalInterval);
  }
}
