import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserInterface } from '../model/user.interface';
import { Observable, from, of, switchMap } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private authservive: AuthService) {}
  @Post('register')
  registor(@Body() userInput: UserInterface) {
    return this.authservive.register(userInput);
  }

  @Post('login')
  login(
    @Body() userInfo: UserInterface,
    @Req() request,
  ): Observable<UserInterface> {
    return this.authservive.login(userInfo).pipe(
      switchMap((user: UserInterface) => {
        const refreshToken = from(this.authservive.getRefreshToken(user)).pipe(
          switchMap((refreshToken) => {
            from(
              this.authservive.setCurrentRefreshToken(refreshToken, user.id),
            );
            return of(refreshToken);
          }),
        );
        const accessToken = from(this.authservive.getAccessToken(user));
        request.res.setHeader('Set-Cookie', [accessToken, refreshToken]);
        return of(user);
      }),
    );
  }
}
