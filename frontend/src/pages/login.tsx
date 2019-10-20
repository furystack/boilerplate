import { Shade, createComponent } from "@furystack/shades";
import { SessionService } from "../services/session";

export const Login = Shade({
  shadowDomName: "shade-login",
  initialState: {
    username: "",
    password: "",
    error: "",
    isOperationInProgress: true,
    count: 0
  },
  construct: ({ injector, updateState, getState }) => {
    const sessionService = injector.getInstance(SessionService);
    const subscriptions = [
      sessionService.loginError.subscribe(
        error => updateState({ error }),
        true
      ),
      sessionService.isOperationInProgress.subscribe(
        isOperationInProgress => updateState({ isOperationInProgress }),
        true
      )
    ];
    setInterval(() => updateState({ count: getState().count + 1 }), 3000);
    return () => subscriptions.map(s => s.dispose());
  },
  render: ({ injector, getState, updateState }) => {
    const { error, username, password } = getState();
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
          <pre>{`[0] @furystack/odata/routing Incoming message: /odata/users/login
[0] @furystack/odata/routing Incoming message: /odata/users/login
[0] @furystack/odata/routing Incoming message: /odata/users/login
[0] @furystack/http-api/HttpUserContext User 'testuser' logged in. {
[0]   user: { roles: [], username: 'testuser' },
[0]   sessionId: 'e029fd20-f367-11e9-b398-6143201dba1b'
[0] }
[0] @furystack/odata/routing Incoming message: /odata/users/isAuthenticated
[0] @furystack/odata/routing Incoming message: /odata/users/logout
[0] @furystack/http-api/HttpUserContext User 'testuser' has been logged out. {
[0]   user: { roles: [], username: 'testuser' },
[0]   sessionId: 'e029fd20-f367-11e9-b398-6143201dba1b'
[0] }`}</pre>
          <form
            onsubmit={ev => {
              ev.preventDefault();
              const state = getState();
              sessinService.login(state.username, state.password);
            }}
          >
            <input
              value={username}
              onchange={ev => {
                updateState({
                  username: (ev.target as HTMLInputElement).value
                });
              }}
              type="text"
            />
            <input
              value={password}
              type="password"
              onchange={ev => {
                updateState({
                  password: (ev.target as HTMLInputElement).value
                });
              }}
            />
            <hr />
            Count: {getState().count.toString()}
            <button type="submit">Login</button>
          </form>
          {error ? <p>{error}</p> : null}
        </div>
      </div>
    );
  }
});
