import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, UpdateUserDto } from './dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Auth, Public } from '../common/decorator';
import { AtGuard, RtGuard } from 'src/common/guard';
import { UserOnJwt } from './types/user-jwt.type';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AtGuard)
  @Delete('logout')
  logout() {
    return this.authService.logout();
  }

  @UseGuards(AtGuard)
  @Get('current')
  current(@Auth() user: UserOnJwt) {
    return this.authService.current(user);
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('token')
  refreshToken(@Auth() user: UserOnJwt) {
    return this.authService.refreshToken(user.sub, user.refreshToken);
  }

  @UseGuards(AtGuard)
  @Patch()
  update(@Auth() user: UserOnJwt, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = this.authService.update(user, updateUserDto);
    return updatedUser;
  }

  @UseGuards(AtGuard)
  @Put('change-password')
  changePassword(
    @Auth() user: UserOnJwt,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.sub, changePasswordDto);
  }
}
