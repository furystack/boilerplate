import { HttpExtendedInjector } from "@furystack/http-api";
import { injector } from "./config";
import { registerExitHandler } from "./exitHandler";

(injector as HttpExtendedInjector).listenHttp({
  port: parseInt(process.env.APP_SERVICE_PORT as string, 10) || 9090
});

registerExitHandler(injector);
