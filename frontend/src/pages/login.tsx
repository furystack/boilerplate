import { Shade, createComponent } from "@furystack/shades";
import { SessionService } from "../services/session";

export const Login = Shade({
  shadowDomName: "shade-login",
  initialState: {
    username: "",
    password: "",
    error: ""
  },
  construct: ({ injector, updateState }) => {
    const subscription = injector
      .getInstance(SessionService)
      .loginError.subscribe(error => updateState({ error }), true);
    return () => subscription.dispose();
  },
  render: ({ injector, getState, updateState }) => {
    const { error } = getState();
    const sessinService = injector.getInstance(SessionService);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px"
        }}
      >
        <div>
          <h1>Login</h1>
          <form
            onsubmit={ev => {
              ev.preventDefault();
              const { username, password } = getState();
              sessinService.login(username, password);
            }}
          >
            <input
              // value={username}
              onchange={ev => {
                updateState(
                  {
                    username: (ev.target as HTMLInputElement).value
                  },
                  true
                );
              }}
              type="text"
            />
            <input
              // value={password}
              type="password"
              onchange={ev => {
                updateState(
                  {
                    password: (ev.target as HTMLInputElement).value
                  },
                  true
                );
              }}
            />
            <button type="submit">Login</button>
          </form>
          {error ? <p>{error}</p> : null}
        </div>
      </div>
    );
  }
});
