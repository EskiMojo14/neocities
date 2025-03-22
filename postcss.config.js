// @ts-check
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    (await import("postcss-extend-rule")).default(),
    (await import("postcss-import")).default(),
  ],
};

export default config;
