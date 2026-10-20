import { IDomainEvent, IUser, UserRole } from '@delivery-service/interfaces';
import { compare, genSalt, hash } from 'bcryptjs';

// РЕВЬЮ DDD: здесь уже есть поведение (хеширование и проверка пароля),
// но общий IUser смешивает хранение, связи и публичные данные. Границу модели стоит уточнить.
export class UserEntity implements IUser {
  id?: number;
  displayName?: string;
  email: string;
  name: string;
  surname: string;
  username: string;
  status: string;
  password: string;
  roles: UserRole;
  // Само поле событий ещё не реализует их создание и обработку; см. раздел DDD в ревью.
  events: IDomainEvent[] = [];
  constructor(user: IUser) {
    this.id = user.id;
    this.displayName = user.displayName;
    this.password = user.password;
    this.status = user.status;
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
  public getPublicProfile() {
    return {
      name: this.name,
      surname: this.surname,
      username: this.username,
      email: this.email,
      status: this.status,
      roles: this.roles,
      displayName: this.displayName,
    };
  }
  public async updateProfile(displayName: string): Promise<UserEntity> {
    this.displayName = displayName;
    return this;
  }
}
