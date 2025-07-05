import * as v from "valibot";

const envSchema = v.object({
  LASTFM_API_KEY: v.string("Env variable LASTFM_API_KEY is required"),
  LASTFM_SECRET: v.string("Env variable LASTFM_SECRET is required"),
  LASTFM_USER: v.string("Env variable LASTFM_USER is required"),
});

type Env = v.InferOutput<typeof envSchema>;

export default v.parse(envSchema, {
  // these need to be referenced explicitly, since they're replaced at build time
  LASTFM_API_KEY: process.env.LASTFM_API_KEY,
  LASTFM_SECRET: process.env.LASTFM_SECRET,
  LASTFM_USER: process.env.LASTFM_USER,
} satisfies Record<keyof Env, string | undefined>);
