import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import { SparkBars } from "./primitives";

test("renders one bar per data point", () => {
  const { container } = render(<SparkBars data={[1, 2, 3]} />);
  expect(container.querySelectorAll("rect")).toHaveLength(3);
});

test("renders an honest empty state instead of NaN geometry on empty input", () => {
  const { container, getByText } = render(<SparkBars data={[]} />);
  expect(container.querySelector("svg")).toBeNull();
  expect(getByText(/no data points yet/i)).toBeTruthy();
});

test("all-zero data does not produce NaN attributes", () => {
  const { container } = render(<SparkBars data={[0, 0]} />);
  for (const rect of container.querySelectorAll("rect")) {
    expect(rect.getAttribute("height")).not.toContain("NaN");
    expect(rect.getAttribute("y")).not.toContain("NaN");
  }
});
