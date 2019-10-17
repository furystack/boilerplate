import { Shade, createComponent } from "@furystack/shades";

export const Offline = Shade({
  shadowDomName: "shade-offline",
  render: () => <div>The app is offline.</div>
});
