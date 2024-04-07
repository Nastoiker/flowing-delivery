import { IDomainEvent, IUser, UserRole } from '@delivery-service/interfaces';
import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity implements IUser {
  id?: number;
  displayName?: string;
  email: string;
  name: string;
  surname: string;
  username: string;
  password: string;
  roles: UserRole;
  events: IDomainEvent[] = [];
  constructor(user: IUser) {
    this.id = user.id;
    this.displayName = user.displayName;
    this.password = user.password;
    this.email = user.email;
    this.roles = user.roles;
  }
  passwordHash: string;
  public async getInfo() {
    return {
      email: this.email,
      role: this.roles,
    };
  }
  public async setPassword(password: string): Promise<UserEntity> {
    const salt = await genSalt(10);
    this.password = await hash(password, salt);
    return this;
  }
  public async PasswordValidate(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
  public async updateProfile(displayName: string): Promise<UserEntity> {
    this.displayName = displayName;
    return this;
  }
}
