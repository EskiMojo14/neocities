import type { ExternalSourcePage, SourcePlugin } from "@greenwood/cli";
import * as v from "valibot";
import type { WithOptional } from "../utils/index.ts";
import { addManyToSet, getOrInsertComputed } from "../utils/index.ts";

const html = String.raw;

const tagData = v.object({
  tags: v.array(v.string()),
});

const paths: Record<
  string,
  {
    create: (
      tag: string,
    ) => WithOptional<ExternalSourcePage, "route" | "title" | "label">;
    itemPlural: string;
  }
> = {
  packages: {
    create(tag) {
      return {
        imports: ["../components/pkg-list/pkg-list.ts"],
        body: html`
          <script
            type="module"
            src="../components/pkg-list/pkg-list.ts"
          ></script>
          <pkg-list tag="${tag}"></pkg-list>
        `,
      };
    },
    itemPlural: "Packages",
  },
  blog: {
    create(tag) {
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
    itemPlural: "Blog Posts",
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
            const pathData = paths[path];
            if (!pathData) return [];
            return Array.from(tags).map((tag) => {
              const created = pathData.create(tag);
              return {
                route: `/${path}/tags/${tag.toLowerCase().replace(/\s/g, "-")}/`,
                title: `${pathData.itemPlural} - ${tag}`,
                label: tag,
                ...created,
                data: {
                  description: `All ${pathData.itemPlural.toLowerCase()} tagged with &quot;${tag}&quot;`,
                  ...created.data,
                },
              };
            });
          },
        );
        return Promise.resolve(pages);
      };
    },
  };
};
