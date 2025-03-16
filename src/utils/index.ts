export const safeAssign: <T extends object>(
  target: T,
  source: Partial<T>,
) => T = Object.assign;

export function assert(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface TypeIntervalConfig {
  /** Time between each character
   * @default 100
   */
  interval?: number;
  /** Minimum time between each character
   * @default 50
   */
  minInterval?: number;
  /** Maximum duration of the animation
   * @default 1000
   */
  maxDuration?: number;
}

export function getTypeInterval(
  text: string,
  {
    interval = 100,
    minInterval = 50,
    maxDuration = 1000,
  }: TypeIntervalConfig = {},
) {
  return Math.max(minInterval, Math.min(interval, maxDuration / text.length));
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type Compute<T> = { [K in keyof T]: T[K] } & unknown;
export type WithOptional<T, K extends keyof T> = Compute<
  Omit<T, K> & Partial<Pick<T, K>>
>;

export function uniqueBy<T>(getKey: (item: T) => unknown) {
  const seen = new Set<unknown>();
  return (item: T) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  };
}

export function frontmatterIsSet(data: string) {
  return !data.startsWith("${");
}

/**
 * Get the active element, including elements in shadow roots.
 *
 * Parent can be used to limit the search to direct children of the parent.
 *
 * If parent is provided and final element is not a child of parent, null is returned.
 */
export function getActiveElement(parent?: HTMLElement) {
  let el = document.activeElement;
  while (el?.shadowRoot && el.parentElement !== parent) {
    el = el.shadowRoot.activeElement;
  }
  if (parent && !parent.contains(el)) return null;
  return el;
}
