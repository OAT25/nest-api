/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../model/user.entity';
import { Observable, from, map, of, switchMap, tap } from 'rxjs';
import { UserInterface } from '../model/user.interface';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwt: JwtService,
  ) {}

  passwordHash(password: string): Observable<string> {
    return from(bcrypt.hash(password, 10));
  }
  isUserExist(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({ where: { email: email } })).pipe(
      switchMap((email) => {
        return of(!!email);
      }),
    );
  }

  register(userInput: UserInterface): Observable<UserInterface> {
    const { name, email, password } = userInput;
    return this.isUserExist(email).pipe(
      tap((email: boolean) => {
        if (email) {
          throw new HttpException('this user already exist', 401);
        }
      }),
      switchMap(() => {
        return this.passwordHash(password).pipe(
          switchMap((hashedPassword) => {
            return from(
              this.userRepository.save({
                name,
                email,
                password: hashedPassword,
              }),
            ).pipe(
              map((userinfo: UserInterface) => {
                delete userinfo.password;
                return userinfo;
              }),
            );
          }),
        );
      }),
    );
  }
  loginValidation(email: string, password: string): Observable<UserInterface> {
    return from(
      this.userRepository.findOne({
        where: { email: email },
        select: ['id', 'name', 'email', 'password', 'role'],
      }),
    ).pipe(
      switchMap((user: UserInterface) => {
        if (user) {
          return from(bcrypt.compare(password, user.password)).pipe(
            switchMap((isPassword: boolean) => {
              if (isPassword) {
                return of(user);
              } else {
                throw new HttpException(
                  'password is not valid',
                  HttpStatus.BAD_REQUEST,
                );
              }
            }),
          );
        } else {
          throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }
      }),
    );
  }

  login(userInput: UserInterface): Observable<any> {
    console.log(userInput);
    const { email, password } = userInput;
    return this.loginValidation(email, password).pipe(switchMap((user)=>{
      return of(user)
    }))
    // .pipe(
    //   switchMap((user: UserInterface) => {
    //     if (user) {
    //       //return from(this.jwt.signAsync({ user }));
    //       const refreshToken=from(this.getRefreshToken(user))
    //       .pipe(switchMap((refreshToken)=>{
    //          from(this.setCurrentRefreshToken(refreshToken,user.id))
    //          const refresh_Token= refreshToken;
    //          return of(refresh_Token)
    //       }));
    //       const accessToken = from(this.getAccessToken(user))
    //       // .pipe(switchMap((accessToken)=>{
    //       //   const access_Token=accessToken
    //       //   return of(access_Token)
    //       // }))
    //       return of([refreshToken,accessToken])
    //     }
    //   }),
    // );
  }

  getAccessToken(userInput: UserInterface): Observable<string>{
    const { id } = userInput;
    return from(
      this.jwt.signAsync({ id }, { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '900s' }))
      .pipe(switchMap((token)=>{
        return `Authentication=${token}; HttpOnly; Path=/;Max-Age='900s'`
      }))
  }
  getRefreshToken(userInput: UserInterface): Observable<string>{
    const { id } = userInput;
    return from(
      this.jwt.signAsync({ id }, { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '1800s' }))
      .pipe(switchMap((token)=>{
        const cookie= `Refresh=${token}; HttpOnly; Path=/;Max-Age='1800s'`
        return cookie
      }))
  }
  setCurrentRefreshToken(refreshToken: string, userId: string) {
    return from(bcrypt.hash(refreshToken, 10)).pipe(switchMap((currentHashedRefreshToken)=>{
      return from(this.userRepository.update(userId, {
       currentHashedRefreshToken: currentHashedRefreshToken
     }))
    }))
  }





  
}
