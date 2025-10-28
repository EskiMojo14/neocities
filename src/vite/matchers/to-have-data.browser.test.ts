import { html } from "lit";
import { expect, it } from "vitest";
import { page } from "vitest/browser";

it("should pass without value", () => {
  page.render(html`<div data-foo="bar">text</div>`);
  expect(page.getByText("text").element()).toHaveData("foo");
});

it("should fail without value", () => {
  page.render(html`<div data-foo="bar">text</div>`);
  expect(() => {
    expect(page.getByText("text").element()).toHaveData("baz");
  }).toThrowErrorMatchingSnapshot();
  expect(() => {
    expect(page.getByText("text").element()).not.toHaveData("foo");
  }).toThrowErrorMatchingSnapshot();
});

it("should pass with value", () => {
  page.render(html`<div data-foo="bar">text</div>`);
  expect(page.getByText("text").element()).toHaveData("foo", "bar");
});

it("should fail with value", () => {
  page.render(html`<div data-foo="bar">text</div>`);
  expect(() => {
    expect(page.getByText("text").element()).toHaveData("foo", "baz");
  }).toThrowErrorMatchingSnapshot();
  expect(() => {
    expect(page.getByText("text").element()).not.toHaveData("foo", "bar");
  }).toThrowErrorMatchingSnapshot();
});

it("should fail with invalid element", () => {
  expect(() => {
    expect(null).toHaveData("foo");
  }).toThrowErrorMatchingSnapshot();
});
