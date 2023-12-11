import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role';
import { PostEntity } from '../../post/entities/post.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({ nullable: true })
  userImg: string;
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
  @OneToMany(() => PostEntity, (postEntity) => postEntity.author)
  posts: PostEntity[];
  @CreateDateColumn()
  createAt: Date;
  @Exclude()
  currentHashedRefreshToken?: string;
}
