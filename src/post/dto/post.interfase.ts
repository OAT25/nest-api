import { UserEntity } from 'src/user/model/user.entity';

export class PostInterface {
  id?: string;

  title?: string;

  content?: string;

  createAt?: Date;

  imgFile?: string;

  videoFIle?: string;

  author?: UserEntity;
}
