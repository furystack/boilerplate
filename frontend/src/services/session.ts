import { Injectable } from "@furystack/inject";
import { ObservableValue } from "@sensenet/client-utils";
import { Users } from "../odata/entity-collections";
import { User } from "../odata/entity-types";

export type sessionState =
  | "initializing"
  | "offline"
  | "unauthenticated"
  | "authenticated";

@Injectable({ lifetime: "singleton" })
export class SessionService {
  public state = new ObservableValue<sessionState>("initializing");

  public currentUser = new ObservableValue<User | null>(null);
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
    const usr = await this.users.login({ username, password });
    this.currentUser.setValue(usr);
    this.state.setValue("authenticated");
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
