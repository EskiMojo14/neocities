import { afterEach, expect, it, vi } from "vite-plus/test";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

it.each(["America/Los_Angeles", "UTC", "Asia/Tokyo"])(
  "preserves date-only calendar dates in %s",
  async (timeZone) => {
    vi.stubEnv("TZ", timeZone);
    vi.resetModules();
    const { dateOnlyFormat } = await import("./index.ts");
    const formatter = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeZone: "UTC",
    });

    for (const date of ["2026-10-07", "2026-01-01", "2024-02-29"]) {
      expect(dateOnlyFormat(date, "normal")).toBe(formatter.format(new Date(date)));
      expect(dateOnlyFormat(date, "code")).toBe(date);
      expect(dateOnlyFormat(date, "paper")).toBe(formatter.format(new Date(date)));
    }
  },
);

it("preserves local-time formatting for timestamp consumers west of UTC", async () => {
  vi.stubEnv("TZ", "America/Los_Angeles");
  vi.resetModules();
  const { dateFormat, dateOnlyFormat, dateRangeFormat, timeFormat } = await import("./index.ts");
  const timestamp = new Date("2026-10-07T00:00:00Z");
  const localFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

  expect(localFormatter.resolvedOptions().timeZone).toBe("America/Los_Angeles");
  expect(timestamp.getDate()).toBe(6);
  expect(dateFormat(timestamp, "normal")).toBe(localFormatter.format(timestamp));
  expect(dateOnlyFormat("2026-10-07", "normal")).not.toBe(dateFormat(timestamp, "normal"));
  expect(dateFormat(timestamp, "code")).toBe("2026-10-07");
  expect(timeFormat(timestamp, "normal")).toBe(
    new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: false,
    }).format(timestamp),
  );
  expect(timeFormat(timestamp, "code")).toBe("2026-10-07T00:00:00Z");
  expect(dateFormat(timestamp, "paper")).toBe(localFormatter.format(timestamp));
  const dateRangeStart = new Date("2026-10-07");
  const dateRangeEnd = new Date("2026-10-09");
  expect(dateRangeFormat(dateRangeStart, dateRangeEnd, "paper")).toBe(
    dateRangeFormat(dateRangeStart, dateRangeEnd, "normal"),
  );
  expect(timeFormat(timestamp, "paper")).toBe(
    new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: false,
    }).format(timestamp),
  );
});
