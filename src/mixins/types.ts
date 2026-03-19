import type { LitElement } from "lit";

// oxlint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: Array<any>) => T;

export type LitConstructor = Constructor<LitElement>;
