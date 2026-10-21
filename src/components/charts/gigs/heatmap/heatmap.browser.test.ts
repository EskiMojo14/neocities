import { html } from "lit";
import { expect, it } from "vite-plus/test";
import { page } from "vite-plus/test/browser";
import gigs from "../gigs.json" with { type: "json" };
import { GigsYearMonthHeatmap } from "./heatmap.ts";

it("uses numeric month labels only in code style and updates when the style changes", async () => {
  const screen = page.render(html`
    <gigs-year-month-heatmap data-testid="heatmap"></gigs-year-month-heatmap>
  `);
  const host = screen.getByTestId("heatmap").element();
  if (!(host instanceof GigsYearMonthHeatmap)) {
    throw new Error("Expected a heatmap");
  }
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  for (const style of ["normal", "code", "normal"] as const) {
    host.pageStyle = style;
    host.requestUpdate();
    for (const [index, month] of monthLabels.entries()) {
      await expect
        .element(
          screen.getByText(style === "code" ? String(index + 1).padStart(2, "0") : month, {
            exact: true,
          }),
        )
        .toBeInTheDocument();
    }
  }
});

it("shows every year from the first recorded gig to the last and the full event count", async () => {
  const screen = page.render(html`<gigs-year-month-heatmap></gigs-year-month-heatmap>`);
  const years = gigs.events.map(({ date }) => Number(date.slice(0, 4)));

  for (let year = Math.min(...years); year <= Math.max(...years); year++) {
    await expect.element(screen.getByText(String(year), { exact: true })).toBeInTheDocument();
  }
  await expect
    .element(screen.getByText(`${gigs.events.length} total events`, { exact: false }))
    .toBeVisible();

  const firstYear = Math.min(...years);
  const firstLabel = screen.getByText(String(firstYear), { exact: true });
  const nextLabel = screen.getByText(String(firstYear + 1), { exact: true });
  const rowHeight = Math.abs(
    nextLabel.element().getBoundingClientRect().y - firstLabel.element().getBoundingClientRect().y,
  );
  expect(rowHeight).toBeGreaterThan(0);
  expect(rowHeight).toBeLessThanOrEqual(40);
});
