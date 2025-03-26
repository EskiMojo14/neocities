import type { ExternalSourcePage, SourcePlugin } from "@greenwood/cli";
import * as v from "valibot";
import {
  addManyToSet,
  capitalize,
  getOrInsertComputed,
} from "../utils/index.ts";

const html = String.raw;

const tagData = v.object({
  tags: v.array(v.string()),
});

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
        const pages = Array.from(tagsByPath.entries()).flatMap(([path, tags]) =>
          Array.from(tags).map(
            (tag): ExternalSourcePage => ({
              route: `/${path}/tags/${tag}/`,
              title: `${capitalize(path)} - ${tag}`,
              imports: ["../components/blog-list/blog-list.ts"],
              body: html`
                <script
                  type="module"
                  src="../components/blog-list/blog-list.ts"
                ></script>
                <blog-list tag="${tag}"></blog-list>
              `,
              label: tag,
            }),
          ),
        );
        return Promise.resolve(pages);
      };
    },
  };
};
