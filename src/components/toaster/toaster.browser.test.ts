import { html } from "lit";
import { expect } from "vitest";
import { page } from "vitest/browser";
import { it } from "../../vite/utils.browser.ts";
import { toast } from "./toaster.ts";

it("should display toast, and close it when the close button is clicked", async () => {
  const screen = page.render(html`<toast-queue></toast-queue>`);
  toast.info("Hello world");

  const toastEl = screen.getByRole("status", { name: "Hello world" });
  await expect.element(toastEl).toBeInTheDocument();

  await toastEl.getByRole("button", { name: "Close notification" }).click();
  await expect.element(toastEl).not.toBeInTheDocument();
});

it("returns a function to close the toast", async () => {
  const screen = page.render(html`<toast-queue></toast-queue>`);
  const close = toast.info("Hello world");

  const toastEl = screen.getByRole("status", { name: "Hello world" });
  await expect.element(toastEl).toBeInTheDocument();

  close();
  await expect.element(toastEl).not.toBeInTheDocument();
});

it("should accept a timeout", async () => {
  const screen = page.render(html`<toast-queue></toast-queue>`);
  toast.success("Nice!", true);

  const toastEl = screen.getByRole("status", { name: "Nice!" });
  await expect.element(toastEl).toBeInTheDocument();

  await expect.element(toastEl).not.toBeInTheDocument();
});

it("stacks multiple toasts", async () => {
  const screen = page.render(html`<toast-queue></toast-queue>`);
  toast.warning("Watch out!");
  toast.error("Oh no!");

  const toastEls = screen.getByRole("status");
  await expect.element(toastEls).toHaveLength(2);
  await expect
    .element(toastEls.filter({ hasText: "Watch out!" }))
    .toBeInTheDocument();
  await expect
    .element(toastEls.filter({ hasText: "Oh no!" }))
    .toBeInTheDocument();
});
