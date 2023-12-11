import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserInterface } from '../model/user.interface';
import { RefreshGuard } from '../guard/jwtrefresh.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(RefreshGuard)
  @Get()
  getUerById(@Body() user: UserInterface, @Req() request) {
    console.log(request.id);
    const userId = user.id;
    return this.userService.getUserById(userId);
  }
}
