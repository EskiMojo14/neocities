import type { Page } from "@greenwood/cli";
import { getContentByRoute } from "@greenwood/cli/src/data/client.js";
import * as v from "valibot";

const baseSchema = v.object({
  title: v.string(),
  description: v.string(),
  route: v.string(),
  icon: v.optional(v.string()),
  tags: v.fallback(v.array(v.string()), []),
});

const pkgSchema = v.object({
  ...baseSchema.entries,
  pkg: v.string(),
  repo: v.string(),
  docs: v.optional(v.string()),
});

// exclude index page and tags
const contentRoutesFor = (path: string) => (page: Page) =>
  page.route !== path && !page.route.startsWith(path + "tags/");

export type Package = v.InferOutput<typeof pkgSchema>;

export async function getPackages() {
  const content = await getContentByRoute("/packages/");
  return content
    .filter(contentRoutesFor("/packages/"))
    .map((page) =>
      v.parse(pkgSchema, {
        pkg: page.data.package,
        repo: page.data.repo,
        docs: page.data.docs,
        description: page.data.description,
        title: page.title,
        route: page.route,
        icon: page.data.icon,
        tags: page.data.tags,
      } satisfies Record<keyof Package, unknown>),
    )
    .sort((a, b) => a.title.localeCompare(b.title));
}

const blogSchema = v.object({
  ...baseSchema.entries,
  published: v.pipe(v.string(), v.isoTimestamp()),
});

export type BlogPost = v.InferOutput<typeof blogSchema>;

export async function getBlogPosts() {
  const content = await getContentByRoute("/blog/");
  return content
    .filter(contentRoutesFor("/blog/"))
    .map((page) =>
      v.parse(blogSchema, {
        title: page.title,
        description: page.data.description,
        route: page.route,
        published: page.data.published,
        icon: page.data.icon,
        tags: page.data.tags,
      } satisfies Record<keyof BlogPost, unknown>),
    )
    .sort((a, b) => b.published.localeCompare(a.published));
}
