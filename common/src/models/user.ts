import { User as FUser } from '@furystack/core'

export class User implements FUser {
  public username!: string
  roles: string[] = []
}
