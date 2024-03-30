// import { compare, genSalt, hash } from 'bcryptjs';

// export class UserEntity implements IUser {
//   _id?: string;
//   displayName?: string;
//   email: string;
//   passwordHash: string;
//   role: UserRole;
//   phones?: IUserPhones[];
//   events: IDomainEvent[] = [];
//   constructor(user: IUser) {
//     this._id = user._id;
//     this.displayName = user.displayName;
//     this.passwordHash = user.passwordHash;
//     this.email = user.email;
//     this.role = user.role;
//     this.phones = user.phones;
//   }
//   public async getInfo() {
//     return {
//       email: this.email,
//       role: this.role,
//     };
//   }
//   public async setPassword(password: string): Promise<UserEntity> {
//     const salt = await genSalt(10);
//     this.passwordHash = await hash(password, salt);
//     return this;
//   }
//   public async PasswordValidate(password: string): Promise<boolean> {
//     return compare(password, this.passwordHash);
//   }
//   public async updateProfile(displayName: string): Promise<UserEntity> {
//     this.displayName = displayName;
//     return this;
//   }
//   public getCourseState(phoneId: string): PurchaseState {
//     return (
//       this.phones.find((phone) => phone.phoneId === phoneId)?.purchasesState ??
//       PurchaseState.started
//     );
//   }
//   public setPhoneStatus(phoneId: string, state: PurchaseState) {
//     const check = this.phones.find((phone) => phone.phoneId === phoneId);
//     if (!check) {
//       this.phones.push({
//         phoneId,
//         purchasesState: PurchaseState.started,
//       });
//     }
//     if (state === PurchaseState.Canceled) {
//       this.phones = this.phones.filter((phone) => phone.phoneId !== phoneId);
//     }
//     this.phones = this.phones.map((phone) => {
//       if (phone.phoneId === phoneId) {
//         phone.purchasesState = state;
//         return phone;
//       }
//       return phone;
//     });
//     this.events.push({
//       topic: AccountChangePhone.topic,
//       data: { phoneId, userId: this._id, state },
//     });
//     return this;
//   }
// }
