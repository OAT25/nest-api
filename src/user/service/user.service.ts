import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { from, of, switchMap } from 'rxjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  getUserById(userId: string) {
    return from(this.userRepository.findOne({ where: { id: userId } }));
  }
  isUserRefreshTokenMatch(refreshToken: string, userId: string) {
    return this.getUserById(userId).pipe(
      switchMap((user) => {
        return from(
          bcrypt.compare(refreshToken, user.currentHashedRefreshToken),
        ).pipe(
          switchMap((match) => {
            if (match) {
              return of(user);
            } else {
              throw new HttpException(
                'user has not refreshtoken',
                HttpStatus.FORBIDDEN,
              );
            }
          }),
        );
      }),
    );
  }
}
