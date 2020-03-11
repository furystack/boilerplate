import { DefaultSession } from '@furystack/rest-service/dist/models/default-session'

export class Session extends DefaultSession {
  public sessionId!: string
  public username!: string
}
