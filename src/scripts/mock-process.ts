if (typeof window !== "undefined") {
  // @ts-expect-error i'm not gonna mock all of that
  window.process = {};
  process.env = {};
}
