export class UserResponse {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  avatar: string;
}
