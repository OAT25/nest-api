import { UserEntity } from '../../user/model/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column({ default: '' })
  content: string;
  @CreateDateColumn()
  createAt: Date;
  @Column({ nullable: true })
  imgFile: string;
  @Column({ nullable: true })
  videoFIle: string;
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts)
  author: UserEntity;
}
