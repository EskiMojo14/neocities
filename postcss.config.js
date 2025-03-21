// @ts-check
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    (await import("postcss-import")).default(),
    (await import("postcss-extend-rule")).default(),
  ],
};

export default config;
