import { Chart } from "@tanstack/charts/lit";
import type { PropertyValues } from "lit";

class HydratableChart extends Chart {
  protected updated(changed: PropertyValues<this>) {
    super.updated(changed);
    // Hydration can assign options after firstUpdated has already attempted to mount.
    void this.updateComplete.then(() => {
      if (this.isConnected) super.firstUpdated();
    });
  }
}

if (typeof window !== "undefined" && !customElements.get("tanstack-chart")) {
  customElements.define("tanstack-chart", HydratableChart);
}
