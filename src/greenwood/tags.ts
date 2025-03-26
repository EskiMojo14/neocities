import type { ExternalSourcePage, SourcePlugin } from "@greenwood/cli";
import * as v from "valibot";
import {
  addManyToSet,
  capitalize,
  getOrInsertComputed,
  type WithOptional,
} from "../utils/index.ts";

const html = String.raw;

const tagData = v.object({
  tags: v.array(v.string()),
});

const pathCreators: Record<
  string,
  (tag: string) => WithOptional<ExternalSourcePage, "route" | "title" | "label">
> = {
  packages(tag) {
    return {
      imports: ["../components/pkg-list/pkg-list.ts"],
      body: html`
        <script type="module" src="../components/pkg-list/pkg-list.ts"></script>
        <pkg-list tag="${tag}"></pkg-list>
      `,
    };
  },
  blog(tag) {
    return {
      imports: ["../components/blog-list/blog-list.ts"],
      body: html`
        <script
          type="module"
          src="../components/blog-list/blog-list.ts"
        ></script>
        <blog-list tag="${tag}"></blog-list>
      `,
    };
  },
};

export const tagsPlugin = (): SourcePlugin => {
  return {
    type: "source",
    name: "eskimojo-plugin-tags",
    provider: (compilation) => {
      const { graph } = compilation;
      const tagsByPath = new Map<string, Set<string>>();

      for (const page of graph) {
        const parsedData = v.safeParse(tagData, page.data);
        if (!parsedData.success) continue;
        const [, basePath] = page.route.split("/");
        if (!basePath) continue;
        addManyToSet(
          getOrInsertComputed(tagsByPath, basePath, () => new Set()),
          parsedData.output.tags,
        );
      }

      return () => {
        const pages = Array.from(tagsByPath.entries()).flatMap(
          ([path, tags]) => {
            const creator = pathCreators[path];
            if (!creator) return [];
            return Array.from(tags).map((tag) => ({
              route: `/${path}/tags/${tag.toLowerCase().replace(/\s/g, "-")}/`,
              title: `${capitalize(path)} - ${tag}`,
              label: tag,
              ...creator(tag),
            }));
          },
        );
        return Promise.resolve(pages);
      };
    },
  };
};
