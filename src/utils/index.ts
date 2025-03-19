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

export function getTypeInterval(text: string, config?: getTypeInterval.Config) {
  const {
    interval = 100,
    minInterval = 50,
    maxDuration = 1000,
  } = { ...getTypeInterval.defaults, ...config };
  return Math.max(minInterval, Math.min(interval, maxDuration / text.length));
}

export namespace getTypeInterval {
  export interface Config {
    interval?: number;
    minInterval?: number;
    maxDuration?: number;
  }
  export const defaults: Required<Config> = {
    interval: 100,
    minInterval: 50,
    maxDuration: 1000,
  };
  export function getDuration(text: string, config?: Config) {
    return getTypeInterval(text, config) * text.length;
  }
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

export const objectKeys: <T extends object>(obj: T) => Array<keyof T> =
  Object.keys;
export const objectEntries: <T extends object>(
  obj: T,
) => Array<
  {
    [K in keyof T]: [K, T[K]];
  }[keyof T]
> = Object.entries;
export const objectFromEntries: <K extends PropertyKey, V>(
  entries: ReadonlyArray<readonly [K, V]>,
) => Record<K, V> = Object.fromEntries;
