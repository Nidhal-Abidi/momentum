import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import "@testing-library/jest-dom";

// Add custom matchers from jest-dom
import "@testing-library/jest-dom/vitest";

// Custom render function that wraps components with providers
function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { ...options });
}

export * from "@testing-library/react";
export { customRender as render };

