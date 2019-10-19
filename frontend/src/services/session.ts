import { Injectable } from "@furystack/inject";
import { ObservableValue } from "@sensenet/client-utils";
import { Users } from "../odata/entity-collections";
import { User } from "../odata/entity-types";

export type sessionState =
  | "initializing"
  | "offline"
  | "unauthenticated"
  | "authenticated"
  | "loginFailed";

@Injectable({ lifetime: "singleton" })
export class SessionService {
  public state = new ObservableValue<sessionState>("initializing");
  public currentUser = new ObservableValue<User | null>(null);

  public loginError = new ObservableValue("");
  private async init() {
    try {
      const { isAuthenticated } = await this.users.isAuthenticated();
      this.state.setValue(
        isAuthenticated ? "authenticated" : "unauthenticated"
      );
    } catch (error) {
      this.state.setValue("offline");
      return;
    }
  }

  public async login(username: string, password: string) {
    try {
      const usr = await this.users.login({ username, password });
      this.currentUser.setValue(usr);
      this.state.setValue("authenticated");
    } catch (error) {
      this.loginError.setValue(error.body.message);
    }
  }

  public async logout() {
    this.users.logout();
    this.currentUser.setValue(null);
    this.state.setValue("unauthenticated");
  }

  constructor(private users: Users) {
    this.init();
  }
}
