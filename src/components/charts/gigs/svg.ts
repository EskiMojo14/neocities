import type { ChartSvgRenderer, SceneNode } from "@tanstack/charts";
import { renderChartSvg } from "@tanstack/charts/svg";

export const addTypography = (node: SceneNode, className = "caption"): SceneNode => {
  if (node.kind === "group") {
    return { ...node, children: node.children.map((child) => addTypography(child, className)) };
  }
  if (node.kind === "label") {
    return { ...node, className: [node.className, className].filter(Boolean).join(" ") };
  }
  return node;
};

export const renderSvg: ChartSvgRenderer = (scene, options) =>
  renderChartSvg({ ...scene, nodes: scene.nodes.map((node) => addTypography(node)) }, options);
