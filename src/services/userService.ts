import { merge } from 'lodash';
import { User, UpdateUser } from './types';

export class UserService {
  static users: User[] = [];

  public addUser(user: User): void {
    if (!UserService.users.find(u => u.id === user.id)) {
      UserService.users.push(user);
    }
  }

  public getUserById(userId: string): User | undefined {
    return UserService.users.find(u => u.id === userId);
  }

  public updateUser(userId: string, user: UpdateUser): void {
    const index = UserService.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      UserService.users[index] = merge({}, UserService.users[index], user);
    }
  }

  public deleteUser(userId: string): void {
    UserService.users = UserService.users.filter(u => u.id !== userId);
  }

  public getUsers(): User[] {
    return UserService.users;
  }
}