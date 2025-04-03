export const safeAssign: <T extends object>(
  target: T,
  ...sources: ReadonlyArray<Partial<NoInfer<T>>>
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

getTypeInterval.defaults = {
  interval: 100,
  minInterval: 50,
  maxDuration: 1000,
} satisfies Required<getTypeInterval.Config>;

getTypeInterval.getDuration = function getDuration(
  text: string,
  config?: getTypeInterval.Config,
) {
  return getTypeInterval(text, config) * text.length;
};

export namespace getTypeInterval {
  export interface Config {
    interval?: number;
    minInterval?: number;
    maxDuration?: number;
  }
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type Compute<T> = { [K in keyof T]: T[K] } & unknown;
export type WithOptional<T, K extends keyof T> = Compute<
  Omit<T, K> & Partial<Pick<T, K>>
>;
export type WithRequired<T, K extends keyof T> = Compute<
  Omit<T, K> & Required<Pick<T, K>>
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

export function getOrInsert<K extends object, V>(
  map: WeakMap<K, V>,
  key: K,
  value: V,
): V;
export function getOrInsert<K, V>(map: Map<K, V>, key: K, value: V): V;
export function getOrInsert<K extends object, V>(
  map: Map<K, V> | WeakMap<K, V>,
  key: K,
  value: V,
): V {
  if (map.has(key)) return map.get(key) as V;

  return map.set(key, value).get(key) as V;
}

export function getOrInsertComputed<K extends object, V>(
  map: WeakMap<K, V>,
  key: K,
  compute: (key: K) => V,
): V;
export function getOrInsertComputed<K, V>(
  map: Map<K, V>,
  key: K,
  compute: (key: K) => V,
): V;
export function getOrInsertComputed<K extends object, V>(
  map: Map<K, V> | WeakMap<K, V>,
  key: K,
  compute: (key: K) => V,
): V {
  if (map.has(key)) return map.get(key) as V;

  return map.set(key, compute(key)).get(key) as V;
}

export function addManyToSet<T>(set: Set<T>, values: Iterable<T>) {
  for (const value of values) {
    set.add(value);
  }
  return set;
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/\s/g, "-");
}

export function capitalize<T extends string>(text: T) {
  return (text.charAt(0).toUpperCase() + text.slice(1)) as Capitalize<T>;
}

// from react redux

function is(x: unknown, y: unknown) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

/* eslint-disable */
export function shallowEqual(objA: any, objB: any) {
  if (is(objA, objB)) return true;

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]!) ||
      !is(objA[keysA[i]!], objB[keysA[i]!])
    ) {
      return false;
    }
  }

  return true;
}
/* eslint-enable */

export const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});
