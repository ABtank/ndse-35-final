import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req): Promise<{
    email: string;
    name: string;
    contactPhone: string;
    token: string;
  }> {
    const token = await this.usersService.login(req.user);
    const resJson = {
      email: req.user.email,
      name: req.user.name,
      contactPhone: req.user.contactPhone,
      token: token.access_token,
    };
    console.log(resJson);
    return resJson;
  }

  @Post('logout')
  async logout(@Request() req): Promise<void> {
    // TODO удалить сессию req.logout() не работает
    req.logout();
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      id: user._id,
      email: user.email,
      name: user.name,
    };
  }
}
