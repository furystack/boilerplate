import { Shade, createComponent } from "@furystack/shades";
import { SessionService } from "../services/session";

export const HelloWorld = Shade({
  shadowDomName: "hello-world",
  render: ({ injector }) => (
    <div>
      HelloWorld
      <button
        onclick={() => {
          injector.getInstance(SessionService).logout();
        }}
      >
        Log out
      </button>
      {/* <Router
          routeMatcher={(current, component) => current.pathname === component}
          routes={[
            { url: "/", component: () => <HomePage /> },
            {
              url: "/fpv",
              component: () => (
                <LazyLoad
                  loader={<div>Loading...</div>}
                  component={async () => {
                    const fpvModule = await import("../pages/fpv");
                    return <fpvModule.FirstPersonView />;
                  }}
                />
              )
            }
          ]}
        /> */}
    </div>
  )
});
