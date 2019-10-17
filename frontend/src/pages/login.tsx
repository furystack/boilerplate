import { Shade, createComponent } from "@furystack/shades";
import { SessionService } from "../services/session";

export const Login = Shade({
  shadowDomName: "shade-login",
  render: ({ injector }) => (
    <div>
      Login
      <button
        onclick={() => {
          injector.getInstance(SessionService).login("testuser", "password");
        }}
      >
        Login
      </button>
    </div>
  )
});
