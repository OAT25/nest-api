import { PostEntity } from 'src/post/entities/post.entity';
import { Role } from './role';

export class UserInterface {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  userImg?: string;
  role?: Role;
  posts?: PostEntity[];
  createAt?: Date;
}
